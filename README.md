# Angular Table Booking - Azure Deployment

This repository contains an Angular 5 table booking application with complete Azure deployment configuration.

## 🚀 Quick Start

### Prerequisites
- Azure account with active subscription
- Node.js and npm installed
- Azure CLI (for command-line deployment)

### Deployment Options

#### Option 1: Manual Deployment (Recommended for first-time)
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build for production
npm run build

# 3. Login to Azure
az login

# 4. Create Azure resources
./azure-deployment-script.sh

# 5. Deploy application
./deploy-manual.sh
```

#### Option 2: GitHub Actions (Continuous Deployment)
1. Push code to GitHub
2. Set up Azure App Service
3. Configure GitHub secrets
4. Automatic deployment on push to main branch

#### Option 3: Azure DevOps
1. Import repository to Azure DevOps
2. Create service connection
3. Configure pipeline with `azure-pipelines.yml`

## 📁 Project Structure

```
├── src/                          # Angular source code
├── dist/                         # Production build output
├── .github/workflows/            # GitHub Actions workflow
├── azure-deployment-script.sh    # Azure resource creation script
├── deploy-manual.sh              # Manual deployment script
├── azure-pipelines.yml           # Azure DevOps pipeline
├── web.config                    # IIS configuration for Azure
└── docs/                         # Deployment documentation
    ├── DEPLOYMENT-GUIDE.md       # Complete deployment guide
    ├── DEPLOYMENT-CHECKLIST.md   # Step-by-step checklist
    ├── CUSTOM-DOMAIN-SSL-GUIDE.md # Domain and SSL setup
    └── TESTING-GUIDE.md          # Testing procedures
```

## 🔧 Configuration Files

### web.config
Configured for Azure App Service (IIS) to handle Angular routing:
- URL rewriting for SPA routes
- MIME type configuration
- Static file serving

### Build Configuration
- Production build with optimization
- Tree shaking and minification
- AOT compilation enabled

## 🌐 Azure Resources

### App Service Configuration
- **Runtime**: Node.js 18.x
- **Platform**: Windows with IIS
- **Minimum Plan**: F1 Free (for testing)
- **SSL**: App Service Managed Certificate available

### Required Azure Resources
- Resource Group
- App Service Plan
- App Service (Web App)
- Application Insights (optional)

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) | Complete step-by-step deployment instructions |
| [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) | Printable checklist for deployment process |
| [CUSTOM-DOMAIN-SSL-GUIDE.md](CUSTOM-DOMAIN-SSL-GUIDE.md) | Custom domain and SSL certificate setup |
| [TESTING-GUIDE.md](TESTING-GUIDE.md) | Testing procedures and troubleshooting |

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**: Use `npm install --legacy-peer-deps` for Angular 5 compatibility
2. **404 on Refresh**: Ensure `web.config` is properly deployed
3. **SSL Issues**: Requires Basic B1+ plan for managed certificates

### Getting Help
- Check Azure App Service logs: `az webapp log tail`
- Review browser console for client-side errors
- Use Azure Portal diagnostics

## 💰 Cost Estimation

| Tier | Monthly Cost | Features |
|------|-------------|----------|
| F1 Free | $0 | 60 CPU minutes/day, no SSL |
| B1 Basic | ~$13 | Always on, SSL, custom domains |
| S1 Standard | ~$56 | Auto-scaling, deployment slots |

## 🔒 Security

- HTTPS-only configuration
- Security headers in web.config
- Azure App Service security features
- Optional: Azure AD authentication

## 📊 Monitoring

- Application Insights integration
- Azure Monitor alerts
- Performance tracking
- Error logging

## 🔄 CI/CD Pipeline Features

- Automated testing
- Build optimization
- Zero-downtime deployment
- Rollback capabilities

## 📞 Support

For deployment issues:
1. Check the troubleshooting section in guides
2. Review Azure documentation
3. Use Azure support resources

## 📝 License

MIT License - see LICENSE file for details

---

## Next Steps After Deployment

1. ✅ Verify application functionality
2. ⚙️ Configure monitoring and alerts
3. 🔐 Set up custom domain and SSL (optional)
4. 📈 Optimize performance
5. 🔒 Implement security best practices
6. 📋 Document the process for your team

For detailed instructions, see the individual guide files in this repository. 
