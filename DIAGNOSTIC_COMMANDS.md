# 🔍 Diagnostic Commands for CORS/404 Issue

## Quick Test Commands

### 1. Test Backend Directly (from VPS)
```bash
# Test auth endpoint
curl http://localhost:5000/api/auth/me -v

# Expected: 401 Unauthorized
```

### 2. Test Through Nginx (from VPS)
```bash
# Test HTTPS through Nginx
curl https://backend.brokerai.ai:8088/api/auth/me -v

# Expected: 401 Unauthorized
```

### 3. Test OPTIONS Preflight (from VPS)
```bash
curl -X OPTIONS https://backend.brokerai.ai:8088/api/auth/me \
  -H "Origin: https://www.brokerai.ai" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v

# Expected: 204 No Content with CORS headers
```

### 4. Test from External (your local machine)
```bash
# Test HTTPS endpoint
curl https://backend.brokerai.ai:8088/api/auth/me -v

# Expected: 401 Unauthorized
```

## 🔍 Diagnostic Checks

### Check Nginx Status
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Check Nginx access log
sudo tail -f /var/log/nginx/access.log
```

### Check Backend Status
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs brokerai-backend --lines 50

# Check if backend receives requests
pm2 logs brokerai-backend | grep "api/auth"
```

### Check Firewall
```bash
# Check firewall status
sudo ufw status

# Open port 8088 if needed
sudo ufw allow 8088/tcp
sudo ufw reload
```

### Check Port Listening
```bash
# Check if port 8088 is listening
sudo netstat -tlnp | grep 8088
# OR
sudo ss -tlnp | grep 8088

# Check if port 5000 is listening (backend)
sudo netstat -tlnp | grep 5000
```

### Test SSL Certificate
```bash
# Check SSL certificate
openssl s_client -connect backend.brokerai.ai:8088 -servername backend.brokerai.ai

# Test certificate validity
echo | openssl s_client -connect backend.brokerai.ai:8088 -servername backend.brokerai.ai 2>/dev/null | openssl x509 -noout -dates
```

## 🌐 Browser Console Tests

Run these in browser console on https://www.brokerai.ai:

```javascript
// Test 1: OPTIONS Preflight
fetch('https://backend.brokerai.ai:8088/api/auth/me', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://www.brokerai.ai',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Authorization'
  }
})
.then(r => {
  console.log('✅ OPTIONS Status:', r.status);
  console.log('CORS Headers:', {
    'access-control-allow-origin': r.headers.get('access-control-allow-origin'),
    'access-control-allow-methods': r.headers.get('access-control-allow-methods'),
    'access-control-allow-headers': r.headers.get('access-control-allow-headers')
  });
})
.catch(err => console.error('❌ OPTIONS Error:', err));

// Test 2: Actual GET Request
fetch('https://backend.brokerai.ai:8088/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token'
  },
  credentials: 'include'
})
.then(r => {
  console.log('✅ GET Status:', r.status);
  console.log('Response Headers:', {
    'access-control-allow-origin': r.headers.get('access-control-allow-origin'),
    'content-type': r.headers.get('content-type')
  });
  return r.json();
})
.then(data => console.log('Response Data:', data))
.catch(err => console.error('❌ GET Error:', err));

// Test 3: Check Network Tab
// Open DevTools → Network tab → Filter by "auth"
// Look for:
// - OPTIONS request (preflight) → Should be 204
// - GET request → Should be 401 (not 404)
```

## 📋 Step-by-Step Fix Procedure

### Step 1: Update Nginx Config
```bash
# SSH into VPS
ssh root@168.231.69.150

# Backup current config
sudo cp /etc/nginx/sites-available/brokerai /etc/nginx/sites-available/brokerai.backup

# Edit config
sudo nano /etc/nginx/sites-available/brokerai

# Paste new config from nginx-brokerai.conf file
# OR use the updated config provided in NGINX_FIX.md

# Test config
sudo nginx -t

# If test passes, reload
sudo systemctl reload nginx
```

### Step 2: Update Backend CORS
```bash
# The server.ts file has been updated locally
# Push to VPS or update directly on VPS

# Restart backend
cd /var/www/brokerai/server
pm2 restart brokerai-backend
# OR
pm2 restart brokerai-backend --update-env
```

### Step 3: Verify Changes
```bash
# Test from VPS
curl -X OPTIONS https://backend.brokerai.ai:8088/api/auth/me \
  -H "Origin: https://www.brokerai.ai" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Should return 204 with CORS headers
```

### Step 4: Test from Browser
1. Open https://www.brokerai.ai
2. Open DevTools (F12)
3. Go to Network tab
4. Try to log in or trigger API call
5. Check:
   - OPTIONS request returns 204
   - GET/POST request returns 401 (not 404)
   - No CORS errors in console

## 🚨 Common Issues

### Issue: Nginx "if is evil" warning
- **Solution**: The warning is safe to ignore for OPTIONS handling
- **Alternative**: Use `map` directive (more complex)

### Issue: Still getting 404
- **Check**: Is backend actually running on port 5000?
  ```bash
  sudo netstat -tlnp | grep 5000
  ```
- **Check**: Is Nginx proxying correctly?
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```

### Issue: CORS errors in browser
- **Check**: CORS headers in response
  ```bash
  curl -I https://backend.brokerai.ai:8088/api/auth/me \
    -H "Origin: https://www.brokerai.ai"
  ```
- **Check**: Backend CORS middleware is before routes
- **Check**: OPTIONS handler is registered

### Issue: SSL certificate errors
- **Check**: Certificate is valid
  ```bash
  sudo certbot certificates
  ```
- **Renew if needed**:
  ```bash
  sudo certbot renew
  ```

## ✅ Success Indicators

After applying fixes, you should see:

1. **OPTIONS request**: 204 No Content with CORS headers
2. **GET request**: 401 Unauthorized (not 404)
3. **Browser console**: No CORS errors
4. **Network tab**: Both OPTIONS and GET requests succeed

