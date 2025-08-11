#!/usr/bin/env bash
set -euo pipefail

# Deploy Angular app via container to Azure Container Apps
# - Builds Docker image and pushes to ACR
# - Creates Container App environment and deploys
#
# Requirements:
# - Azure CLI with containerapp and acr extensions: az extension add -n containerapp; az extension add -n acrtransfer || true
# - Logged in: az login
# - Docker available for local builds
#
# Variables (override via env):
#   APP_NAME            Default: angular-table-booking
#   RESOURCE_GROUP      Default: ${APP_NAME}-rg
#   LOCATION            Default: eastus
#   ACR_NAME            Default: derived from APP_NAME + random suffix (lowercase alnum, <= 50)
#   IMAGE_TAG           Default: latest

APP_NAME=${APP_NAME:-angular-table-booking}
RESOURCE_GROUP=${RESOURCE_GROUP:-"${APP_NAME}-rg"}
LOCATION=${LOCATION:-eastus}
IMAGE_TAG=${IMAGE_TAG:-latest}

acr_base=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]')
acr_suffix=$(printf "%04d" $(( RANDOM % 10000 )))
ACR_NAME=${ACR_NAME:-${acr_base}${acr_suffix}}

IMAGE="$ACR_NAME.azurecr.io/$APP_NAME:$IMAGE_TAG"

log() { printf "\n[%s] %s\n" "$(date +%H:%M:%S)" "$*"; }

ensure_tools() {
  az extension add -n containerapp >/dev/null 2>&1 || true
}

ensure_login() {
  az account show >/dev/null 2>&1 || { log "Run: az login"; exit 1; }
}

provision() {
  log "Create resource group..."
  az group create --name "$RESOURCE_GROUP" --location "$LOCATION" 1>/dev/null

  log "Create ACR '$ACR_NAME'..."
  az acr create --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" --sku Basic --location "$LOCATION" 1>/dev/null

  log "Enable admin on ACR (for push)..."
  az acr update -n "$ACR_NAME" --admin-enabled true 1>/dev/null

  log "Get ACR credentials..."
  ACR_USER=$(az acr credential show -n "$ACR_NAME" --query username -o tsv)
  ACR_PASS=$(az acr credential show -n "$ACR_NAME" --query passwords[0].value -o tsv)

  log "Docker login..."
  echo "$ACR_PASS" | docker login "$ACR_NAME.azurecr.io" -u "$ACR_USER" --password-stdin 1>/dev/null

  log "Create Container Apps env..."
  az containerapp env create -g "$RESOURCE_GROUP" -n "${APP_NAME}-env" --location "$LOCATION" 1>/dev/null
}

build_push() {
  log "Build Docker image $IMAGE ..."
  docker build -t "$IMAGE" .
  log "Push image..."
  docker push "$IMAGE"
}

deploy() {
  log "Deploy Container App..."
  az containerapp create \
    -g "$RESOURCE_GROUP" \
    -n "$APP_NAME" \
    --image "$IMAGE" \
    --environment "${APP_NAME}-env" \
    --ingress external \
    --target-port 80 \
    --registry-server "$ACR_NAME.azurecr.io" \
    --registry-username "$ACR_USER" \
    --registry-password "$ACR_PASS" 1>/dev/null

  URL=$(az containerapp show -g "$RESOURCE_GROUP" -n "$APP_NAME" --query properties.configuration.ingress.fqdn -o tsv)
  log "App available at: https://$URL"
}

main(){
  log "App: $APP_NAME | RG: $RESOURCE_GROUP | Location: $LOCATION | ACR: $ACR_NAME"
  ensure_tools
  ensure_login
  provision
  build_push
  deploy
}

main "$@"