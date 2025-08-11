#!/usr/bin/env bash
set -euo pipefail

# Deploy Angular (CLI 1.7) app as a Static Website to Azure Storage
# - Builds inside Docker with Node 10 to avoid local Node compatibility issues
# - Publishes the ./dist folder to the $web container
#
# Requirements:
# - Docker installed and running (for build step)
# - Azure CLI installed and logged in: az login
# - Azure subscription selected (optional): az account set --subscription <SUBSCRIPTION_ID>
#
# Optional environment variables to override defaults:
#   APP_NAME           Default: angular-table-booking
#   RESOURCE_GROUP     Default: ${APP_NAME}-rg
#   LOCATION           Default: eastus
#   STORAGE_ACCOUNT    Default: derived from APP_NAME (lowercase, trimmed) + random suffix
#   DIST_DIR           Default: dist

APP_NAME=${APP_NAME:-angular-table-booking}
RESOURCE_GROUP=${RESOURCE_GROUP:-"${APP_NAME}-rg"}
LOCATION=${LOCATION:-eastus}
DIST_DIR=${DIST_DIR:-dist}

# Compute a safe storage account name: 3-24 lowercase alphanumeric
# Derive from APP_NAME and add random suffix to reduce collisions
sa_base=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]')
sa_suffix=$(printf "%04d" $(( RANDOM % 10000 )))
sa_combined="${sa_base}${sa_suffix}"
STORAGE_ACCOUNT=${STORAGE_ACCOUNT:-${sa_combined:0:24}}

command_exists() { command -v "$1" >/dev/null 2>&1; }

log() { printf "\n[%s] %s\n" "$(date +%H:%M:%S)" "$*"; }

ensure_az_logged_in() {
  if ! az account show >/dev/null 2>&1; then
    log "Azure CLI not logged in. Run: az login"
    exit 1
  fi
}

build_with_docker() {
  if ! command_exists docker; then
    log "Docker is required for a consistent build environment. Please install Docker or build locally with a compatible Node (v10) and run: npm install && ./node_modules/.bin/ng build --prod"
    exit 1
  fi

  log "Starting Angular production build in Docker (Node 10)..."
  docker run --rm \
    -v "$PWD":/workspace \
    -w /workspace \
    node:10-buster bash -lc "set -euo pipefail; \ 
      node -v; npm -v; \ 
      npm ci || npm install; \ 
      ./node_modules/.bin/ng version || (npm install -g @angular/cli@1.7.2 && ng --version); \ 
      ./node_modules/.bin/ng build --prod"

  if [ ! -d "$DIST_DIR" ]; then
    log "Build failed: directory '$DIST_DIR' not found."
    exit 1
  fi
  log "Build completed. Output: $DIST_DIR"
}

provision_resources() {
  log "Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..."
  az group create --name "$RESOURCE_GROUP" --location "$LOCATION" 1>/dev/null

  log "Creating storage account '$STORAGE_ACCOUNT'..."
  az storage account create \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2 1>/dev/null

  log "Enabling static website hosting (index.html as index and 404)..."
  az storage blob service-properties update \
    --account-name "$STORAGE_ACCOUNT" \
    --static-website \
    --index-document index.html \
    --404-document index.html 1>/dev/null
}

upload_site() {
  log "Uploading '$DIST_DIR' to '$web' container..."
  az storage blob upload-batch \
    --account-name "$STORAGE_ACCOUNT" \
    --auth-mode login \
    --destination "\$web" \
    --source "$DIST_DIR" \
    --no-progress 1>/dev/null

  SITE_URL=$(az storage account show \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --query "primaryEndpoints.web" -o tsv)

  log "Deployment complete: $SITE_URL"
}

main() {
  log "App: $APP_NAME"
  log "Resource Group: $RESOURCE_GROUP"
  log "Location: $LOCATION"
  log "Storage Account: $STORAGE_ACCOUNT"
  log "Dist Dir: $DIST_DIR"

  ensure_az_logged_in
  build_with_docker
  provision_resources
  upload_site
}

main "$@"