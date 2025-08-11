#!/bin/bash

# Manual deployment script for Azure App Service
# Prerequisites: Azure CLI installed and logged in (az login)

# Load configuration
if [ -f "azure-config.txt" ]; then
    source azure-config.txt
else
    # If config doesn't exist, set manually
    echo "Please set your Azure App Service details:"
    read -p "Resource Group name: " RESOURCE_GROUP
    read -p "App Service name: " APP_NAME
fi

echo "Deploying to Azure App Service..."
echo "Resource Group: $RESOURCE_GROUP"
echo "App Name: $APP_NAME"

# Create a deployment package
echo "Creating deployment package..."
cd dist
zip -r ../deployment.zip .
cd ..

# Deploy to Azure
echo "Uploading to Azure..."
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --src deployment.zip

echo "Deployment completed!"
echo "Your app should be available at: https://$APP_NAME.azurewebsites.net"

# Clean up
rm deployment.zip