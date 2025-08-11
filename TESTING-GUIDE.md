# Testing Guide for Deployed Angular Application

## Pre-Deployment Testing

Before deploying, ensure these tests pass locally:

### Local Build Testing
```bash
# Build for production
npm run build

# Serve the production build locally
npx http-server dist -p 8080

# Test at http://localhost:8080
```

### Local Testing Checklist
- [ ] Application loads without errors
- [ ] All routes work correctly
- [ ] Static assets (CSS, images) load properly
- [ ] No console errors in browser developer tools
- [ ] Angular routing works (no 404 on page refresh)

## Post-Deployment Testing

### Basic Functionality Tests

1. **Application Loading**
   - [ ] Navigate to `https://your-app-name.azurewebsites.net`
   - [ ] Page loads within reasonable time (< 5 seconds)
   - [ ] No loading errors displayed

2. **Angular Routing Tests**
   - [ ] Navigate to different routes using the application menu
   - [ ] Refresh the page on each route (should not show 404)
   - [ ] Browser back/forward buttons work correctly
   - [ ] Direct URL access works for all routes

3. **Static Assets**
   - [ ] CSS styles are applied correctly
   - [ ] Images load properly
   - [ ] Favicon appears in browser tab
   - [ ] No 404 errors for static files

### Browser Compatibility Testing

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if applicable)
- [ ] Edge (latest)
- [ ] Mobile browsers (Chrome/Safari mobile)

### Performance Testing

1. **Load Time Analysis**
   - Use browser developer tools → Network tab
   - Check initial page load time
   - Identify any slow-loading resources

2. **Lighthouse Audit**
   - Open Chrome DevTools → Lighthouse tab
   - Run audit for Performance, Accessibility, Best Practices, SEO
   - Target scores: Performance > 80, others > 90

### Responsive Design Testing

Test on different screen sizes:
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (768x1024, 1024x768)
- [ ] Mobile (375x667, 414x896)

Use Chrome DevTools device emulation for testing.

## Automated Testing Scripts

### PowerShell Testing Script
```powershell
# test-deployment.ps1
$appUrl = "https://your-app-name.azurewebsites.net"

Write-Host "Testing deployment at: $appUrl"

# Test main page
try {
    $response = Invoke-WebRequest -Uri $appUrl -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Main page loads successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Main page failed to load: $($_.Exception.Message)" -ForegroundColor Red
}

# Test specific routes
$routes = @("/", "/route1", "/route2")  # Add your actual routes
foreach ($route in $routes) {
    try {
        $fullUrl = $appUrl + $route
        $response = Invoke-WebRequest -Uri $fullUrl -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Route $route works" -ForegroundColor Green
        }
    } catch {
        Write-Host "✗ Route $route failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

### Bash Testing Script
```bash
#!/bin/bash
# test-deployment.sh

APP_URL="https://your-app-name.azurewebsites.net"
echo "Testing deployment at: $APP_URL"

# Test main page
if curl -f -s "$APP_URL" > /dev/null; then
    echo "✓ Main page loads successfully"
else
    echo "✗ Main page failed to load"
    exit 1
fi

# Test specific routes
routes=("/" "/route1" "/route2")  # Add your actual routes
for route in "${routes[@]}"; do
    if curl -f -s "$APP_URL$route" > /dev/null; then
        echo "✓ Route $route works"
    else
        echo "✗ Route $route failed"
    fi
done

echo "Testing completed"
```

## Azure-Specific Testing

### App Service Health Check
1. **Azure Portal Monitoring**
   - Go to Azure Portal → Your App Service
   - Check "Overview" for any errors or warnings
   - Review "Metrics" for performance data

2. **Application Logs**
   ```bash
   # Stream logs in real-time
   az webapp log tail --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP
   
   # Download logs for analysis
   az webapp log download --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP
   ```

### SSL/HTTPS Testing
- [ ] HTTP automatically redirects to HTTPS
- [ ] SSL certificate is valid and trusted
- [ ] No mixed content warnings
- [ ] Test with [SSL Labs](https://www.ssllabs.com/ssltest/)

### Custom Domain Testing (if configured)
- [ ] Custom domain resolves correctly
- [ ] HTTPS works with custom domain
- [ ] Both www and non-www versions work (if configured)

## Troubleshooting Common Issues

### 1. Application Won't Load
**Symptoms:** White screen, loading indefinitely
**Solutions:**
- Check browser console for JavaScript errors
- Verify all static assets are loading
- Check Azure App Service logs
- Ensure Node.js version compatibility

### 2. 404 Errors on Page Refresh
**Symptoms:** Direct URL access or page refresh shows 404
**Solutions:**
- Verify web.config is present and correct
- Check URL rewriting rules
- Ensure Angular routing is properly configured

### 3. Static Assets Not Loading
**Symptoms:** Missing styles, images, or other assets
**Solutions:**
- Check file paths in build output
- Verify assets are included in deployment
- Check Content-Type headers

### 4. Performance Issues
**Symptoms:** Slow loading times
**Solutions:**
- Enable gzip compression in Azure
- Optimize bundle sizes
- Check network connectivity
- Review Application Insights data

## Monitoring and Alerts

### Set Up Application Insights
1. Create Application Insights resource
2. Add connection string to App Service configuration
3. Monitor:
   - Page load times
   - User sessions
   - Exceptions and errors
   - Custom events

### Azure Monitor Alerts
Configure alerts for:
- High response times (> 5 seconds)
- HTTP error rates (> 5%)
- Application failures
- High CPU/memory usage

## Load Testing

### Basic Load Testing with curl
```bash
# Simple load test
for i in {1..100}; do
    curl -s -o /dev/null -w "%{http_code}\n" https://your-app-name.azurewebsites.net
done
```

### Using Azure Load Testing
1. Create Azure Load Testing resource
2. Upload JMeter test plan
3. Configure test parameters
4. Run load tests and analyze results

## Security Testing

### OWASP ZAP Scan
1. Install OWASP ZAP
2. Run automated scan against your application
3. Review security vulnerabilities
4. Fix identified issues

### Security Headers Check
Use [Security Headers](https://securityheaders.com/) to verify:
- Content Security Policy
- HTTPS Strict Transport Security
- X-Frame-Options
- X-Content-Type-Options

## Accessibility Testing

### Automated Testing
- Use Lighthouse accessibility audit
- Install axe DevTools browser extension
- Run automated accessibility tests

### Manual Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast meets standards
- [ ] Alt text for images

## Documentation

### Test Results Documentation
Create a test report including:
- Test execution date
- Browser/device combinations tested
- Performance metrics
- Issues found and resolution status
- Screenshots of key functionality

### Example Test Report Template
```
Test Execution Report
Date: [Date]
Tester: [Name]
Application URL: [URL]

Browser Compatibility:
✓ Chrome 118
✓ Firefox 119
✓ Safari 17
✓ Edge 118

Performance:
- Initial load time: 2.3s
- Lighthouse Performance score: 85
- Largest Contentful Paint: 1.8s

Issues Found:
1. [Issue description] - [Status: Fixed/Open]
2. [Issue description] - [Status: Fixed/Open]

Overall Status: PASS/FAIL
```

## Continuous Testing

### Automated Testing Pipeline
Integrate these tests into your CI/CD pipeline:
1. Unit tests (run during build)
2. End-to-end tests (run after deployment)
3. Performance tests (scheduled)
4. Security scans (weekly)

### Monitoring Dashboard
Set up a dashboard to track:
- Application uptime
- Response times
- Error rates
- User satisfaction scores