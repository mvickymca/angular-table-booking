# Angular Application Deployment Guide for Azure

This guide provides step-by-step instructions for deploying your Angular application to Azure using different methods.

## Prerequisites

Before you begin, ensure you have:

1. **Azure Account**: Sign up for a free Azure account at [https://azure.microsoft.com/free/](https://azure.microsoft.com/free/)
2. **Azure CLI**: Install from [https://docs.microsoft.com/cli/azure/install-azure-cli](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **Node.js and npm**: Already installed (as per your package.json)
4. **Git**: For version control and deployment

## Method 1: Azure Static Web Apps (Recommended for SPAs)

Azure Static Web Apps is the easiest and most cost-effective way to deploy Angular applications.

### Step 1: Build Your Angular Application

```bash
# Install dependencies
npm install

# Build the production version
npm run build
```

This creates a `dist/` folder with your compiled application.

### Step 2: Create Azure Static Web App

#### Option A: Using Azure Portal

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App" and select it
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: Choose a unique name (e.g., `my-angular-app`)
   - **Region**: Select closest to your users
   - **SKU**: Free
   - **Source**: GitHub/Azure DevOps (for CI/CD) or Other (for manual deployment)

#### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create a resource group
az group create --name myResourceGroup --location "East US"

# Create Static Web App
az staticwebapp create \
    --name my-angular-app \
    --resource-group myResourceGroup \
    --location "East US" \
    --sku Free
```

### Step 3: Deploy Your Application

#### Manual Deployment:

1. Install Static Web Apps CLI:
```bash
npm install -g @azure/static-web-apps-cli
```

2. Deploy:
```bash
# From your project root
swa deploy ./dist --deployment-token <YOUR_DEPLOYMENT_TOKEN>
```

#### GitHub Actions (Automated):

1. Push your code to GitHub
2. Azure will automatically create a GitHub Actions workflow
3. Edit `.github/workflows/azure-static-web-apps-<name>.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "dist" # Built app content directory
          app_build_command: "npm run build"
```

## Method 2: Azure App Service

Azure App Service provides more control and features but costs more than Static Web Apps.

### Step 1: Build Your Application

```bash
npm install
npm run build
```

### Step 2: Create Web App

#### Using Azure Portal:

1. Go to Azure Portal
2. Create a resource → Web App
3. Configure:
   - **Name**: Unique app name
   - **Runtime stack**: Node.js 18 LTS
   - **OS**: Linux (recommended) or Windows
   - **Region**: Choose closest
   - **App Service Plan**: Select or create new

#### Using Azure CLI:

```bash
# Create App Service Plan
az appservice plan create \
    --name myAppServicePlan \
    --resource-group myResourceGroup \
    --sku B1 \
    --is-linux

# Create Web App
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name my-angular-webapp \
    --runtime "NODE|18-lts"
```

### Step 3: Configure Startup

Create a `server.js` file in your project root:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the app
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "ng build --prod"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### Step 4: Deploy

#### Using Git Deployment:

```bash
# Configure deployment credentials
az webapp deployment user set \
    --user-name <username> \
    --password <password>

# Get Git URL
az webapp deployment source config-local-git \
    --name my-angular-webapp \
    --resource-group myResourceGroup

# Add Azure remote
git remote add azure <GIT_URL_FROM_ABOVE>

# Push to deploy
git push azure main
```

#### Using ZIP Deployment:

```bash
# Create ZIP of your app
zip -r myapp.zip . -x "node_modules/*" ".git/*"

# Deploy
az webapp deployment source config-zip \
    --resource-group myResourceGroup \
    --name my-angular-webapp \
    --src myapp.zip
```

## Method 3: Azure Storage Static Website Hosting

Most cost-effective for static content, but requires Azure CDN for HTTPS custom domains.

### Step 1: Build Application

```bash
npm install
npm run build
```

### Step 2: Create Storage Account

```bash
# Create storage account
az storage account create \
    --name mystorageaccount \
    --resource-group myResourceGroup \
    --location "East US" \
    --sku Standard_LRS

# Enable static website
az storage blob service-properties update \
    --account-name mystorageaccount \
    --static-website \
    --index-document index.html \
    --404-document index.html
```

### Step 3: Upload Files

```bash
# Get storage key
STORAGE_KEY=$(az storage account keys list \
    --account-name mystorageaccount \
    --resource-group myResourceGroup \
    --query '[0].value' -o tsv)

# Upload files
az storage blob upload-batch \
    --account-name mystorageaccount \
    --account-key $STORAGE_KEY \
    --destination '$web' \
    --source ./dist
```

### Step 4: Configure CDN (Optional, for custom domain + HTTPS)

```bash
# Create CDN profile
az cdn profile create \
    --resource-group myResourceGroup \
    --name myCDNProfile \
    --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
    --resource-group myResourceGroup \
    --profile-name myCDNProfile \
    --name myCDNEndpoint \
    --origin mystorageaccount.z13.web.core.windows.net \
    --origin-host-header mystorageaccount.z13.web.core.windows.net
```

## Post-Deployment Configuration

### 1. Custom Domain

For all methods, you can add a custom domain:

```bash
# Add custom domain
az webapp config hostname add \
    --webapp-name my-angular-webapp \
    --resource-group myResourceGroup \
    --hostname www.yourdomain.com
```

### 2. SSL Certificate

- **Static Web Apps**: Free SSL included
- **App Service**: Use managed certificates or upload your own
- **Storage + CDN**: Configure through CDN endpoint

### 3. Environment Variables

For App Service:

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name my-angular-webapp \
    --settings API_URL="https://api.example.com"
```

### 4. Monitoring

Enable Application Insights:

```bash
az monitor app-insights component create \
    --app myAppInsights \
    --location "East US" \
    --resource-group myResourceGroup
```

## CI/CD Pipeline Examples

### Azure DevOps Pipeline

Create `azure-pipelines.yml`:

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm run build
  displayName: 'npm install and build'

- task: AzureWebApp@1
  inputs:
    azureSubscription: 'YOUR_SUBSCRIPTION'
    appType: 'webAppLinux'
    appName: 'my-angular-webapp'
    package: '$(System.DefaultWorkingDirectory)/dist'
```

### GitHub Actions for App Service

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18.x'
    
    - name: npm install and build
      run: |
        npm install
        npm run build
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'my-angular-webapp'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./dist
```

## Troubleshooting

### Common Issues:

1. **404 errors on refresh**: Ensure your web server redirects all routes to index.html
2. **Build errors**: Check Node.js version compatibility
3. **Deployment failures**: Verify resource names are unique and valid

### Debugging Commands:

```bash
# View app logs
az webapp log tail \
    --name my-angular-webapp \
    --resource-group myResourceGroup

# Check deployment logs
az webapp log deployment show \
    --name my-angular-webapp \
    --resource-group myResourceGroup
```

## Cost Optimization

1. **Static Web Apps**: Free tier includes:
   - 100 GB bandwidth/month
   - 2 custom domains
   - Free SSL

2. **App Service**: 
   - Use B1 tier for dev/test
   - Scale up only when needed
   - Use deployment slots for staging

3. **Storage + CDN**:
   - Pay only for storage and bandwidth
   - Most cost-effective for high traffic

## Summary

- **Use Static Web Apps** for modern SPAs with simple deployment needs
- **Use App Service** when you need server-side features or more control
- **Use Storage + CDN** for maximum cost efficiency with static content

Choose based on your specific requirements for features, control, and budget.