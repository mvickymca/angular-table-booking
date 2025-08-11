# Azure Deployment Quick Start Guide

## Prerequisites Checklist
- [ ] Azure Account ([Sign up free](https://azure.microsoft.com/free/))
- [ ] Azure CLI installed ([Installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli))
- [ ] Node.js and npm installed
- [ ] Git installed

## Quick Deployment Options

### Option 1: Use the Automated Script (Easiest)

```bash
# For Azure Static Web Apps (Recommended)
./deploy-to-azure.sh --method static-web-app --app-name my-angular-app

# For Azure App Service
./deploy-to-azure.sh --method app-service --app-name my-angular-app

# For Azure Storage
./deploy-to-azure.sh --method storage --app-name my-angular-app
```

### Option 2: Manual Deployment Steps

#### Azure Static Web Apps (Fastest & Free)

1. **Build your app:**
   ```bash
   npm install
   npm run build
   ```

2. **Install SWA CLI:**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

3. **Login to Azure:**
   ```bash
   az login
   ```

4. **Create and deploy:**
   ```bash
   # Create resource group
   az group create --name myResourceGroup --location eastus

   # Create Static Web App
   az staticwebapp create --name my-angular-app --resource-group myResourceGroup

   # Get deployment token
   TOKEN=$(az staticwebapp secrets list --name my-angular-app --query "properties.apiKey" -o tsv)

   # Deploy
   swa deploy ./dist --deployment-token $TOKEN
   ```

#### Azure App Service

1. **Build and prepare:**
   ```bash
   npm install
   npm run build
   ```

2. **Create resources:**
   ```bash
   # Login
   az login

   # Create resource group
   az group create --name myResourceGroup --location eastus

   # Create App Service Plan
   az appservice plan create --name myPlan --resource-group myResourceGroup --sku B1 --is-linux

   # Create Web App
   az webapp create --name my-angular-app --resource-group myResourceGroup --plan myPlan --runtime "NODE|18-lts"
   ```

3. **Deploy:**
   ```bash
   # Create deployment package
   zip -r app.zip dist server.js package.json package-lock.json

   # Deploy
   az webapp deployment source config-zip --name my-angular-app --resource-group myResourceGroup --src app.zip
   ```

## Files Created for Deployment

| File | Purpose | Required For |
|------|---------|--------------|
| `AZURE_DEPLOYMENT_GUIDE.md` | Complete deployment guide | Reference |
| `staticwebapp.config.json` | SPA routing configuration | Static Web Apps |
| `server.js` | Express server for Node.js | App Service |
| `web.config` | IIS configuration | App Service (Windows) |
| `deploy-to-azure.sh` | Automated deployment script | All methods |
| `.github/workflows/azure-static-web-apps.yml` | GitHub Actions CI/CD | Static Web Apps |
| `azure-pipelines.yml` | Azure DevOps CI/CD | All methods |

## Common Commands

### Check deployment status:
```bash
# Static Web Apps
az staticwebapp show --name my-angular-app

# App Service
az webapp show --name my-angular-app

# View logs
az webapp log tail --name my-angular-app --resource-group myResourceGroup
```

### Update deployment:
```bash
# Rebuild and redeploy
npm run build
swa deploy ./dist --deployment-token $TOKEN  # For Static Web Apps
# OR
az webapp deployment source config-zip --name my-angular-app --src app.zip  # For App Service
```

### Clean up resources:
```bash
# Delete entire resource group
az group delete --name myResourceGroup --yes
```

## Quick Tips

1. **Choose Static Web Apps** if:
   - You want free hosting
   - Your app is a pure SPA
   - You need automatic CI/CD from GitHub

2. **Choose App Service** if:
   - You need server-side functionality
   - You want more control over the environment
   - You need custom domains with more flexibility

3. **Choose Storage + CDN** if:
   - You want the lowest cost for high traffic
   - You're okay with manual deployments
   - You don't need server-side features

## Troubleshooting

- **404 errors on refresh**: Check that routing configuration files are present
- **Build errors**: Ensure Node.js version compatibility
- **Deployment failures**: Verify Azure subscription and resource names

## Next Steps

1. Set up custom domain
2. Configure SSL certificates
3. Enable Application Insights for monitoring
4. Set up staging environments
5. Configure auto-scaling (App Service only)