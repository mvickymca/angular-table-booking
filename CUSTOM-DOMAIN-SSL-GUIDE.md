# Custom Domain and SSL Configuration Guide

## Adding a Custom Domain to Azure App Service

### Prerequisites
- A registered domain name
- Access to your domain's DNS settings
- Azure App Service deployed and running

### Step 1: Add Custom Domain in Azure Portal

1. **Navigate to your App Service**
   - Go to [Azure Portal](https://portal.azure.com)
   - Find and select your App Service

2. **Open Custom Domains**
   - In the left menu, click "Custom domains"
   - Click "+ Add custom domain"

3. **Configure Domain**
   - Enter your domain name (e.g., `www.yourdomain.com` or `yourdomain.com`)
   - Click "Validate"

### Step 2: Configure DNS Records

Azure will show you the required DNS records. You'll need to add these to your domain provider:

#### For Subdomain (www.yourdomain.com):
```
Type: CNAME
Name: www
Value: your-app-name.azurewebsites.net
```

#### For Root Domain (yourdomain.com):
```
Type: A
Name: @
Value: [IP address provided by Azure]

Type: TXT
Name: asuid.yourdomain.com
Value: [Verification ID provided by Azure]
```

### Step 3: Verify Domain
1. Add the DNS records at your domain provider
2. Wait for DNS propagation (can take up to 48 hours)
3. Return to Azure Portal and click "Validate" again
4. If successful, click "Add custom domain"

## SSL Certificate Configuration

### Option 1: App Service Managed Certificate (Recommended - Free)

1. **Prerequisites for Managed Certificate**
   - Custom domain must be added and verified
   - App Service Plan must be Basic B1 or higher (not available on Free F1 tier)

2. **Create Managed Certificate**
   - Go to your App Service → "TLS/SSL settings"
   - Click "Private Key Certificates (.pfx)"
   - Click "+ Create App Service Managed Certificate"
   - Select your custom domain
   - Click "Create"

3. **Bind Certificate**
   - Go to "Custom domains" in your App Service
   - Find your domain and click "Add binding"
   - Select your certificate
   - Choose "SNI SSL"
   - Click "Add Binding"

### Option 2: Upload Your Own Certificate

1. **Prepare Certificate**
   - Obtain SSL certificate from a Certificate Authority
   - Ensure it's in .pfx format with private key

2. **Upload Certificate**
   - Go to "TLS/SSL settings" → "Private Key Certificates (.pfx)"
   - Click "Upload Certificate"
   - Select your .pfx file
   - Enter the certificate password
   - Click "Upload"

3. **Bind Certificate**
   - Follow the same binding steps as Option 1

### Option 3: Import from Key Vault

1. **Store Certificate in Key Vault**
   - Upload your certificate to Azure Key Vault
   - Grant App Service access to Key Vault

2. **Import Certificate**
   - Go to "TLS/SSL settings" → "Private Key Certificates (.pfx)"
   - Click "Import from Key Vault"
   - Select your Key Vault and certificate
   - Click "Import"

3. **Bind Certificate**
   - Follow the same binding steps as previous options

## Configure HTTPS Redirect

1. **Enable HTTPS Only**
   - Go to your App Service → "TLS/SSL settings"
   - Turn on "HTTPS Only"
   - This forces all HTTP traffic to redirect to HTTPS

2. **Verify Configuration**
   - Test both `http://` and `https://` versions of your domain
   - Ensure HTTP redirects to HTTPS automatically

## DNS Configuration Examples

### Cloudflare DNS Settings
```
Type: CNAME
Name: www
Content: your-app-name.azurewebsites.net
Proxy status: DNS only (gray cloud)

Type: CNAME
Name: @
Content: your-app-name.azurewebsites.net
Proxy status: DNS only (gray cloud)
```

### GoDaddy DNS Settings
```
Type: CNAME
Host: www
Points to: your-app-name.azurewebsites.net

Type: A
Host: @
Points to: [Azure IP address]

Type: TXT
Host: asuid
TXT Value: [Azure verification ID]
```

### Namecheap DNS Settings
```
Type: CNAME Record
Host: www
Value: your-app-name.azurewebsites.net

Type: A Record
Host: @
Value: [Azure IP address]

Type: TXT Record
Host: asuid
Value: [Azure verification ID]
```

## Troubleshooting

### Common Issues

1. **Domain Validation Fails**
   - Check DNS records are correct
   - Wait for DNS propagation (up to 48 hours)
   - Use DNS checker tools to verify records

2. **Certificate Creation Fails**
   - Ensure App Service Plan is Basic B1 or higher
   - Verify domain is properly validated and added
   - Check for conflicting DNS records

3. **SSL Binding Fails**
   - Ensure certificate is properly created/uploaded
   - Check App Service Plan supports SSL
   - Verify domain ownership

### DNS Propagation Check
Use these online tools to check DNS propagation:
- [whatsmydns.net](https://www.whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)

### SSL Certificate Check
Verify SSL configuration with:
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- Browser developer tools

## Security Best Practices

1. **Use Strong TLS Version**
   - Configure minimum TLS version to 1.2
   - Disable older, insecure versions

2. **HTTP Security Headers**
   Add these headers in `web.config`:
   ```xml
   <httpHeaders>
     <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains" />
     <add name="X-Content-Type-Options" value="nosniff" />
     <add name="X-Frame-Options" value="DENY" />
     <add name="X-XSS-Protection" value="1; mode=block" />
   </httpHeaders>
   ```

3. **Certificate Renewal**
   - App Service Managed Certificates auto-renew
   - Set up alerts for certificate expiration
   - Monitor certificate health regularly

## Cost Considerations

- **App Service Managed Certificate**: Free with Basic B1+ plans
- **Custom Certificates**: Cost varies by certificate provider
- **App Service Plan**: Basic B1 minimum required for SSL (~$13/month)
- **Custom Domain**: Domain registration fees apply

## Maintenance

1. **Monitor Certificate Expiration**
   - Set up Azure Monitor alerts
   - Check certificate status regularly

2. **DNS Changes**
   - Document all DNS changes
   - Test after any DNS modifications

3. **Backup Configuration**
   - Export App Service configuration
   - Document custom domain and SSL settings