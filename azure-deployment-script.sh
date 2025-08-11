#!/bin/bash

# Azure CLI script to create App Service for Angular deployment
# Make sure you're logged in: az login

# Variables (customize these)
RESOURCE_GROUP="angular-table-booking-rg"
APP_NAME="angular-table-booking-$(date +%s)"  # Adding timestamp for uniqueness
LOCATION="eastus"
PLAN_NAME="angular-table-booking-plan"

echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "Creating App Service plan..."
az appservice plan create --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku F1 --is-linux

echo "Creating Web App..."
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $APP_NAME --runtime "NODE|18-lts"

echo "Configuring app settings..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings WEBSITE_NODE_DEFAULT_VERSION=18.x SCM_DO_BUILD_DURING_DEPLOYMENT=false

echo "App Service created successfully!"
echo "App URL: https://$APP_NAME.azurewebsites.net"
echo "Resource Group: $RESOURCE_GROUP"
echo "App Name: $APP_NAME"

# Save these values for deployment
echo "RESOURCE_GROUP=$RESOURCE_GROUP" > azure-config.txt
echo "APP_NAME=$APP_NAME" >> azure-config.txt