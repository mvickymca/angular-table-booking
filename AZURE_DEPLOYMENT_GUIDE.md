# Azure Deployment Guide for Angular Table Booking Application

This guide provides step-by-step instructions for deploying your Angular application to Microsoft Azure using multiple deployment methods.

## Prerequisites

Before deploying to Azure, ensure you have:

1. **Azure Account**: [Create a free Azure account](https://azure.microsoft.com/free/) if you don't have one
2. **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
3. **Node.js and npm**: Ensure you have Node.js installed (version 8+ for Angular 5)
4. **Git**: For version control and deployment

## Method 1: Azure Static Web Apps (Recommended for Angular SPAs)

Azure Static Web Apps is perfect for Angular applications as it provides global CDN, custom domains, and automatic SSL.

### Step 1: Prepare Your Application

```bash
# Navigate to your project directory
cd /workspace

# Install dependencies
npm install

# Build the application for production
npm run build
```

### Step 2: Login to Azure

```bash
# Login to Azure CLI
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "your-subscription-id"
```

### Step 3: Deploy via Azure Portal

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create a new resource** → Search for "Static Web Apps"
3. **Click "Create"**
4. **Fill in the details**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: `angular-table-booking-app`
   - **Plan type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
5. **Deployment details**:
   - **Source**: GitHub (you'll need to connect your GitHub account)
   - **Organization**: Your GitHub username/organization
   - **Repository**: Your repository name
   - **Branch**: main/master
6. **Build Details**:
   - **Build Presets**: Angular
   - **App location**: `/` (root of your repo)
   - **Build location**: `dist` (where ng build outputs files)

### Step 4: Configure GitHub Actions (Automatic)

Azure will automatically create a GitHub Actions workflow file in `.github/workflows/` that will:
- Build your Angular app on every push
- Deploy to Azure Static Web Apps

### Step 5: Custom Domain (Optional)

1. Go to your Static Web App in Azure Portal
2. Navigate to **Custom domains**
3. Click **Add** and follow the DNS configuration steps

---

## Method 2: Azure App Service

Azure App Service is great for applications that need server-side functionality or more control over the hosting environment.

### Step 1: Create Azure App Service

```bash
# Create a resource group
az group create --name angular-table-booking-rg --location "East US"

# Create an App Service plan
az appservice plan create --name angular-table-booking-plan --resource-group angular-table-booking-rg --sku FREE --is-linux

# Create the web app
az webapp create --resource-group angular-table-booking-rg --plan angular-table-booking-plan --name angular-table-booking-app --runtime "NODE:18-lts"
```

### Step 2: Configure Deployment

```bash
# Configure local git deployment
az webapp deployment source config-local-git --name angular-table-booking-app --resource-group angular-table-booking-rg

# Get the deployment URL (note this URL for later)
az webapp deployment list-publishing-credentials --name angular-table-booking-app --resource-group angular-table-booking-rg
```

### Step 3: Prepare Application for App Service

Create a `web.config` file in your `src` folder for proper routing:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Step 4: Deploy

```bash
# Build the application
npm run build

# Initialize git in dist folder (if not already done)
cd dist
git init
git add .
git commit -m "Initial deployment"

# Add Azure remote and push
git remote add azure <deployment-url-from-step-2>
git push azure master
```

---

## Method 3: Azure Storage Static Website

Cost-effective option for static Angular applications.

### Step 1: Create Storage Account

```bash
# Create storage account
az storage account create --name angulartablebooking --resource-group angular-table-booking-rg --location "East US" --sku Standard_LRS --kind StorageV2

# Enable static website hosting
az storage blob service-properties update --account-name angulartablebooking --static-website --404-document 404.html --index-document index.html
```

### Step 2: Build and Upload

```bash
# Build the application
npm run build

# Upload files to $web container
az storage blob upload-batch --account-name angulartablebooking --auth-mode key --destination '$web' --source ./dist
```

### Step 3: Get Website URL

```bash
# Get the static website URL
az storage account show --name angulartablebooking --resource-group angular-table-booking-rg --query "primaryEndpoints.web" --output tsv
```

---

## Method 4: Azure DevOps CI/CD Pipeline

Automated deployment pipeline for continuous integration and deployment.

### Step 1: Create Azure DevOps Project

1. Go to https://dev.azure.com
2. Create a new project
3. Import your repository or connect to GitHub

### Step 2: Create Build Pipeline

Create `azure-pipelines.yml` in your repository root:

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm run build
  displayName: 'npm install and build'

- task: CopyFiles@2
  inputs:
    Contents: 'dist/**'
    TargetFolder: '$(Build.ArtifactStagingDirectory)'

- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'drop'
    publishLocation: 'Container'
```

### Step 3: Create Release Pipeline

1. Go to **Pipelines** → **Releases**
2. Create new release pipeline
3. Add an artifact (your build pipeline)
4. Add a stage for deployment
5. Configure deployment to your chosen Azure service

---

## Environment Configuration

### Development vs Production

Update your `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-endpoint.azurewebsites.net/api',
  // Add other production-specific configurations
};
```

### Security Considerations

1. **HTTPS**: All Azure hosting options provide free SSL certificates
2. **CORS**: Configure CORS if you have API endpoints
3. **Authentication**: Consider Azure AD B2C for user authentication
4. **Environment Variables**: Use Azure App Settings for sensitive configuration

---

## Monitoring and Logging

### Application Insights

Add Application Insights to monitor your application:

```bash
# Create Application Insights resource
az monitor app-insights component create --app angular-table-booking-insights --location "East US" --resource-group angular-table-booking-rg --application-type web
```

### Logging

- **Azure Static Web Apps**: Built-in logging and monitoring
- **App Service**: Use Azure Monitor and Application Insights
- **Storage**: Enable storage analytics

---

## Custom Domain and SSL

### For Static Web Apps
1. Navigate to **Custom domains** in Azure Portal
2. Add your domain
3. Configure DNS records as instructed

### For App Service
```bash
# Add custom domain
az webapp config hostname add --webapp-name angular-table-booking-app --resource-group angular-table-booking-rg --hostname yourdomain.com

# Enable SSL
az webapp config ssl bind --certificate-thumbprint <thumbprint> --ssl-type SNI --name angular-table-booking-app --resource-group angular-table-booking-rg
```

---

## Troubleshooting

### Common Issues

1. **Routing Issues**: Ensure you have proper rewrite rules for SPA routing
2. **Build Failures**: Check Node.js version compatibility
3. **CORS Errors**: Configure CORS in your API backend
4. **404 Errors**: Verify index.html is being served for all routes

### Useful Commands

```bash
# View deployment logs (App Service)
az webapp log tail --name angular-table-booking-app --resource-group angular-table-booking-rg

# Restart app service
az webapp restart --name angular-table-booking-app --resource-group angular-table-booking-rg

# Check deployment status
az webapp deployment list --name angular-table-booking-app --resource-group angular-table-booking-rg
```

---

## Cost Optimization

1. **Use Free Tiers**: Start with free tiers for development
2. **Static Web Apps**: Most cost-effective for SPAs
3. **Storage**: Cheapest option for simple static hosting
4. **App Service**: Use only if you need advanced features

---

## Next Steps

1. Choose the deployment method that best fits your needs
2. Set up monitoring and logging
3. Configure custom domains if needed
4. Implement CI/CD pipeline for automated deployments
5. Consider implementing Azure CDN for better global performance

## Support Resources

- [Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)