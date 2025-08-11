# Azure Deployment Checklist

## Pre-Deployment

- [ ] Azure account is active and accessible
- [ ] Azure CLI installed (for manual deployment)
- [ ] Node.js and npm are installed
- [ ] Angular application builds successfully locally
- [ ] web.config file is created and included in build

## Azure Setup

- [ ] Resource Group created
- [ ] App Service Plan created (F1 Free tier or higher)
- [ ] Web App created with correct settings:
  - [ ] Runtime: Node.js 18.x
  - [ ] Platform: Windows (recommended)
  - [ ] Region selected

## Deployment Method Selection

Choose one:
- [ ] Manual deployment with Azure CLI
- [ ] GitHub Actions (continuous deployment)
- [ ] Azure DevOps Pipelines

## Manual Deployment Steps

- [ ] Azure CLI login completed: `az login`
- [ ] Resource creation script executed: `./azure-deployment-script.sh`
- [ ] Build completed: `npm run build`
- [ ] Deployment script executed: `./deploy-manual.sh`

## GitHub Actions Setup (if chosen)

- [ ] Repository pushed to GitHub
- [ ] Azure publish profile downloaded
- [ ] GitHub secrets configured:
  - [ ] AZURE_WEBAPP_NAME
  - [ ] AZURE_WEBAPP_PUBLISH_PROFILE
- [ ] Workflow file (`.github/workflows/azure-deploy.yml`) in repository
- [ ] First deployment triggered and successful

## Azure DevOps Setup (if chosen)

- [ ] Azure DevOps project created
- [ ] Repository imported
- [ ] Service connection to Azure created
- [ ] Pipeline file (`azure-pipelines.yml`) configured
- [ ] First pipeline run successful

## Post-Deployment Verification

- [ ] Application loads at Azure URL: `https://your-app-name.azurewebsites.net`
- [ ] All pages navigate correctly (Angular routing works)
- [ ] Static assets load (CSS, images, etc.)
- [ ] No console errors in browser
- [ ] Application functions as expected

## Optional Configuration

- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] Application Insights enabled
- [ ] Backup strategy configured
- [ ] Scaling rules set up (if needed)

## Monitoring Setup

- [ ] Azure monitoring enabled
- [ ] Log streaming tested
- [ ] Alert rules configured (optional)

## Documentation

- [ ] Deployment process documented for team
- [ ] Access credentials securely stored
- [ ] Rollback procedure documented

## Notes

Date of deployment: ___________
App URL: https://_________________________.azurewebsites.net
Resource Group: _________________________
App Service Name: _______________________
Deployed by: ____________________________