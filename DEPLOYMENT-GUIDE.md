# Angular Table Booking - Azure Deployment Guide

This guide provides step-by-step instructions to deploy your Angular application to Azure App Service.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed (for command-line deployment)
- Node.js and npm installed
- Your Angular application built for production

## Deployment Options

### Option 1: Manual Deployment (Quickest for one-time deployment)

#### Step 1: Install Azure CLI
```bash
# Windows (using chocolatey)
choco install azure-cli

# macOS (using homebrew)
brew install azure-cli

# Ubuntu/Debian
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

#### Step 2: Login to Azure
```bash
az login
```

#### Step 3: Create Azure Resources
Run the provided script to create your Azure App Service:
```bash
./azure-deployment-script.sh
```

#### Step 4: Deploy Your Application
```bash
./deploy-manual.sh
```

### Option 2: GitHub Actions (Best for continuous deployment)

#### Step 1: Push your code to GitHub
```bash
git add .
git commit -m "Add Azure deployment configuration"
git push origin main
```

#### Step 2: Set up Azure App Service
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Web App (as described in the main guide)
3. Go to your Web App → Deployment Center
4. Choose GitHub as source
5. Authorize GitHub and select your repository
6. Download the publish profile

#### Step 3: Configure GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `AZURE_WEBAPP_NAME`: Your Azure Web App name
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Content of the publish profile file

#### Step 4: The deployment will trigger automatically on push to main branch

### Option 3: Azure DevOps (Best for enterprise environments)

#### Step 1: Create Azure DevOps Project
1. Go to [Azure DevOps](https://dev.azure.com)
2. Create a new project
3. Import your repository

#### Step 2: Create Service Connection
1. Project Settings → Service connections
2. Create new service connection for Azure Resource Manager
3. Authorize with your Azure subscription

#### Step 3: Create Pipeline
1. Pipelines → Create Pipeline
2. Select your repository
3. Use the provided `azure-pipelines.yml` file
4. Update the service connection name in the file

## Deployment Process Details

### Build Process
1. Install dependencies: `npm install --legacy-peer-deps`
2. Build for production: `npm run build`
3. Files are generated in the `dist/` folder

### Azure Configuration
- **Runtime**: Node.js 18.x
- **Platform**: Windows (with IIS)
- **Document Root**: Points to dist folder
- **URL Rewriting**: Configured via web.config for Angular routing

### Files Included in Deployment
- `index.html` - Main application file
- `*.bundle.js` - JavaScript bundles
- `*.bundle.css` - CSS bundles
- `web.config` - IIS configuration for Angular routing
- `favicon.ico` - Application icon
- `assets/` - Static assets (if any)

## Post-Deployment Configuration

### Environment Variables (if needed)
Set these in Azure Portal → App Service → Configuration:
- `NODE_ENV`: `production`
- `WEBSITE_NODE_DEFAULT_VERSION`: `18.x`

### Custom Domain (Optional)
1. Azure Portal → Your App Service → Custom domains
2. Add your domain
3. Configure DNS records as instructed

### SSL Certificate (Optional)
1. Azure Portal → Your App Service → TLS/SSL settings
2. Add certificate (free with App Service Managed Certificate)

## Monitoring and Troubleshooting

### View Logs
```bash
# Stream logs
az webapp log tail --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP

# Download logs
az webapp log download --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP
```

### Common Issues
1. **404 on refresh**: Ensure web.config is included and properly configured
2. **Build failures**: Check Node.js version compatibility
3. **Deployment timeout**: Large applications may need higher timeout settings

### Application Insights (Optional)
1. Create Application Insights resource
2. Configure connection string in App Service
3. Monitor performance and errors

## Cost Management

### Free Tier Limitations
- F1 Free tier: 60 minutes/day, 1GB storage
- Suitable for development and testing

### Scaling Options
- Scale up: Increase instance size (CPU, RAM)
- Scale out: Increase number of instances
- Auto-scaling available in higher tiers

## Security Best Practices

1. Use HTTPS only (force redirect)
2. Configure CORS if needed
3. Set up authentication (Azure AD, etc.) if required
4. Regular security updates

## Backup Strategy

1. Enable App Service backup
2. Configure backup schedule
3. Store backups in Azure Storage

## Next Steps

After successful deployment:
1. Test all application features
2. Set up monitoring and alerts
3. Configure custom domain and SSL
4. Set up backup strategy
5. Document the deployment process for your team

For issues or questions, check Azure documentation or contact support.