#!/bin/bash

# Azure Deployment Script for Angular Application
# This script helps automate the deployment process to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_message "Checking prerequisites..." "$YELLOW"

if ! command_exists az; then
    print_message "Azure CLI is not installed. Please install it first." "$RED"
    print_message "Visit: https://docs.microsoft.com/cli/azure/install-azure-cli" "$RED"
    exit 1
fi

if ! command_exists npm; then
    print_message "npm is not installed. Please install Node.js and npm first." "$RED"
    exit 1
fi

# Default values
RESOURCE_GROUP="angular-app-rg"
LOCATION="eastus"
APP_NAME=""
DEPLOYMENT_METHOD=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --method)
            DEPLOYMENT_METHOD="$2"
            shift 2
            ;;
        --app-name)
            APP_NAME="$2"
            shift 2
            ;;
        --resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        --location)
            LOCATION="$2"
            shift 2
            ;;
        --help)
            echo "Usage: ./deploy-to-azure.sh --method [static-web-app|app-service|storage] --app-name <name> [options]"
            echo ""
            echo "Options:"
            echo "  --method           Deployment method: static-web-app, app-service, or storage"
            echo "  --app-name         Name for your Azure resource"
            echo "  --resource-group   Resource group name (default: angular-app-rg)"
            echo "  --location         Azure region (default: eastus)"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate required parameters
if [ -z "$DEPLOYMENT_METHOD" ]; then
    print_message "Error: --method is required" "$RED"
    echo "Use --help for usage information"
    exit 1
fi

if [ -z "$APP_NAME" ]; then
    print_message "Error: --app-name is required" "$RED"
    echo "Use --help for usage information"
    exit 1
fi

# Login to Azure
print_message "Logging in to Azure..." "$YELLOW"
az account show >/dev/null 2>&1 || az login

# Create resource group
print_message "Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..." "$YELLOW"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

# Build the Angular application
print_message "Building Angular application..." "$YELLOW"
npm install
npm run build

# Deploy based on selected method
case $DEPLOYMENT_METHOD in
    "static-web-app")
        print_message "Deploying to Azure Static Web Apps..." "$GREEN"
        
        # Create Static Web App
        print_message "Creating Static Web App '$APP_NAME'..." "$YELLOW"
        DEPLOYMENT_TOKEN=$(az staticwebapp create \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --sku Free \
            --query "defaultHostname" \
            --output tsv)
        
        # Get deployment token
        TOKEN=$(az staticwebapp secrets list \
            --name "$APP_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query "properties.apiKey" \
            --output tsv)
        
        # Install SWA CLI if not installed
        if ! command_exists swa; then
            print_message "Installing Static Web Apps CLI..." "$YELLOW"
            npm install -g @azure/static-web-apps-cli
        fi
        
        # Deploy
        print_message "Deploying application..." "$YELLOW"
        swa deploy ./dist --deployment-token "$TOKEN" --env production
        
        print_message "Deployment complete! Your app is available at: https://$DEPLOYMENT_TOKEN" "$GREEN"
        ;;
        
    "app-service")
        print_message "Deploying to Azure App Service..." "$GREEN"
        
        # Create App Service Plan
        print_message "Creating App Service Plan..." "$YELLOW"
        az appservice plan create \
            --name "${APP_NAME}-plan" \
            --resource-group "$RESOURCE_GROUP" \
            --sku B1 \
            --is-linux \
            --output none
        
        # Create Web App
        print_message "Creating Web App '$APP_NAME'..." "$YELLOW"
        az webapp create \
            --resource-group "$RESOURCE_GROUP" \
            --plan "${APP_NAME}-plan" \
            --name "$APP_NAME" \
            --runtime "NODE|18-lts" \
            --output none
        
        # Configure startup command
        az webapp config set \
            --resource-group "$RESOURCE_GROUP" \
            --name "$APP_NAME" \
            --startup-file "node server.js" \
            --output none
        
        # Deploy using ZIP
        print_message "Creating deployment package..." "$YELLOW"
        zip -r deploy.zip dist server.js package.json package-lock.json web.config
        
        print_message "Deploying application..." "$YELLOW"
        az webapp deployment source config-zip \
            --resource-group "$RESOURCE_GROUP" \
            --name "$APP_NAME" \
            --src deploy.zip \
            --output none
        
        # Clean up
        rm deploy.zip
        
        URL=$(az webapp show \
            --resource-group "$RESOURCE_GROUP" \
            --name "$APP_NAME" \
            --query "defaultHostName" \
            --output tsv)
        
        print_message "Deployment complete! Your app is available at: https://$URL" "$GREEN"
        ;;
        
    "storage")
        print_message "Deploying to Azure Storage with Static Website..." "$GREEN"
        
        # Storage account names must be lowercase and alphanumeric
        STORAGE_NAME=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr -d '-')
        
        # Create Storage Account
        print_message "Creating Storage Account '$STORAGE_NAME'..." "$YELLOW"
        az storage account create \
            --name "$STORAGE_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --sku Standard_LRS \
            --kind StorageV2 \
            --output none
        
        # Enable static website
        print_message "Enabling static website hosting..." "$YELLOW"
        az storage blob service-properties update \
            --account-name "$STORAGE_NAME" \
            --static-website \
            --index-document index.html \
            --404-document index.html \
            --output none
        
        # Get storage key
        STORAGE_KEY=$(az storage account keys list \
            --account-name "$STORAGE_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query '[0].value' \
            --output tsv)
        
        # Upload files
        print_message "Uploading application files..." "$YELLOW"
        az storage blob upload-batch \
            --account-name "$STORAGE_NAME" \
            --account-key "$STORAGE_KEY" \
            --destination '$web' \
            --source ./dist \
            --output none
        
        # Get the URL
        URL=$(az storage account show \
            --name "$STORAGE_NAME" \
            --resource-group "$RESOURCE_GROUP" \
            --query "primaryEndpoints.web" \
            --output tsv)
        
        print_message "Deployment complete! Your app is available at: $URL" "$GREEN"
        print_message "Note: For HTTPS with custom domain, you'll need to set up Azure CDN." "$YELLOW"
        ;;
        
    *)
        print_message "Error: Invalid deployment method '$DEPLOYMENT_METHOD'" "$RED"
        echo "Valid methods: static-web-app, app-service, storage"
        exit 1
        ;;
esac

print_message "Deployment successful!" "$GREEN"
print_message "Resource Group: $RESOURCE_GROUP" "$YELLOW"
print_message "Location: $LOCATION" "$YELLOW"