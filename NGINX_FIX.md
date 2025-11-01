# Nginx & CORS Configuration Fix

## 🔍 Problem Diagnosis

Browser requests return 404, but curl works. This indicates:
1. **CORS preflight (OPTIONS)** requests not handled
2. **Nginx proxy** may not forward CORS headers
3. **Express CORS** middleware may need explicit OPTIONS handling

## ✅ Solution 1: Fixed Nginx Configuration

Update `/etc/nginx/sites-available/brokerai`:

```nginx
server {
    listen 8088 ssl http2;
    server_name backend.brokerai.ai;

    ssl_certificate /etc/letsencrypt/live/backend.brokerai.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/backend.brokerai.ai/privkey.pem;

    # Handle CORS preflight (OPTIONS) requests
    location /api {
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://www.brokerai.ai';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept, Origin, X-Requested-With';
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Max-Age' '1728000';
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # Proxy to backend
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Standard headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache bypass for dynamic content
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket endpoint (if needed)
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## ✅ Solution 2: Enhanced Backend CORS Configuration

Update `server/server.ts`:

```typescript
import cors from 'cors';

// CORS Configuration
const allowedOrigins = [
  'https://www.brokerai.ai',
  'https://brokerai.ai',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));
```

## 🔧 Implementation Steps

### Step 1: Update Nginx Config

```bash
# SSH into VPS
ssh root@168.231.69.150

# Edit Nginx config
sudo nano /etc/nginx/sites-available/brokerai

# Paste the new configuration above

# Test Nginx config
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### Step 2: Update Backend CORS

```bash
# On local machine, update server.ts with enhanced CORS config
# Then push to VPS or update directly on VPS
```

### Step 3: Restart Backend

```bash
# On VPS
cd /var/www/brokerai/server
pm2 restart brokerai-backend
# OR if using tsx watch:
pm2 restart brokerai-backend
```

## 🧪 Testing Commands

### Test 1: Nginx Proxy (from VPS)

```bash
# Test direct backend
curl http://localhost:5000/api/auth/me

# Test through Nginx
curl https://backend.brokerai.ai:8088/api/auth/me

# Test OPTIONS preflight
curl -X OPTIONS https://backend.brokerai.ai:8088/api/auth/me \
  -H "Origin: https://www.brokerai.ai" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

### Test 2: From Browser Console (on https://www.brokerai.ai)

```javascript
// Test OPTIONS preflight
fetch('https://backend.brokerai.ai:8088/api/auth/me', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://www.brokerai.ai',
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Authorization'
  }
})
.then(r => {
  console.log('OPTIONS Status:', r.status);
  console.log('CORS Headers:', {
    'access-control-allow-origin': r.headers.get('access-control-allow-origin'),
    'access-control-allow-methods': r.headers.get('access-control-allow-methods'),
    'access-control-allow-headers': r.headers.get('access-control-allow-headers')
  });
  return r;
})
.catch(console.error);

// Test actual request
fetch('https://backend.brokerai.ai:8088/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token'
  },
  credentials: 'include'
})
.then(r => {
  console.log('GET Status:', r.status);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(console.error);
```

### Test 3: Check Firewall

```bash
# Check if port 8088 is open
sudo ufw status
sudo ufw allow 8088/tcp

# Check if Nginx is listening
sudo netstat -tlnp | grep 8088
# OR
sudo ss -tlnp | grep 8088
```

## 🔍 Diagnostic Commands

### Check Nginx Logs

```bash
# Real-time error log
sudo tail -f /var/log/nginx/error.log

# Access log
sudo tail -f /var/log/nginx/access.log

# Check for CORS-related errors
sudo grep -i cors /var/log/nginx/error.log
```

### Check Backend Logs

```bash
# PM2 logs
pm2 logs brokerai-backend --lines 50

# Check if OPTIONS requests are reaching backend
pm2 logs brokerai-backend | grep OPTIONS
```

### Test SSL Certificate

```bash
# Check certificate
openssl s_client -connect backend.brokerai.ai:8088 -servername backend.brokerai.ai

# Test from external server
curl -v https://backend.brokerai.ai:8088/api/auth/me
```

## 🚨 Common Issues & Fixes

### Issue 1: Nginx "if" is evil warning

If you see warnings about `if` directive:
- Use `map` directive instead, OR
- Ignore the warning (it's safe for OPTIONS handling)

### Issue 2: CORS headers not set by backend

Make sure Express CORS middleware is before routes:
```typescript
app.use(cors(corsOptions));  // BEFORE app.use('/api', apiRoutes);
app.use('/api', apiRoutes);
```

### Issue 3: Mixed Content Error

If frontend is HTTPS but backend is HTTP:
- Ensure backend URL uses `https://` in frontend code
- Verify SSL certificate is valid

### Issue 4: Preflight fails

Add explicit OPTIONS handler in Express:
```typescript
app.options('*', cors(corsOptions));
```

## ✅ Expected Results

After fixes:

1. **OPTIONS request** should return:
   - Status: 204 No Content
   - Headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.

2. **GET/POST request** should return:
   - Status: 401 (if no token) or 200 (if authenticated)
   - Headers: CORS headers included

3. **Browser console** should show:
   - No CORS errors
   - Request succeeds with proper status code

## 📝 Quick Fix Checklist

- [ ] Update Nginx config with OPTIONS handling
- [ ] Test Nginx config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Update backend CORS configuration
- [ ] Restart backend: `pm2 restart brokerai-backend`
- [ ] Test OPTIONS request from browser console
- [ ] Test actual API request from browser console
- [ ] Check browser Network tab for proper headers
- [ ] Verify no CORS errors in console

