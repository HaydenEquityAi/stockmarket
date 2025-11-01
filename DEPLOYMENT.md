# Frontend Deployment Guide

## Quick Deploy (PowerShell)

```powershell
.\deploy-frontend.ps1
```

## Quick Deploy (Batch)

```cmd
deploy-frontend.bat
```

## Manual Deployment

### Step 1: Build Frontend

```powershell
npm run build
```

### Step 2: Upload Files

**Option A: SCP (Single command)**
```powershell
scp -r dist/* root@168.231.69.150:/var/www/brokerai/frontend/
```

**Option B: Individual files**
```powershell
# Upload index.html
scp dist/index.html root@168.231.69.150:/var/www/brokerai/frontend/

# Upload assets folder
scp -r dist/assets root@168.231.69.150:/var/www/brokerai/frontend/
```

### Step 3: Set Permissions (on VPS)

```bash
ssh root@168.231.69.150
chown -R www-data:www-data /var/www/brokerai/frontend
chmod -R 755 /var/www/brokerai/frontend
exit
```

## One-Line Deploy (PowerShell)

```powershell
npm run build; scp -r dist/* root@168.231.69.150:/var/www/brokerai/frontend/; ssh root@168.231.69.150 "chown -R www-data:www-data /var/www/brokerai/frontend && chmod -R 755 /var/www/brokerai/frontend"
```

## Troubleshooting

### SCP not found
- Install OpenSSH: Settings → Apps → Optional Features → OpenSSH Client

### Permission denied
- Ensure SSH key is set up, or use password authentication
- Check VPS user has write access to `/var/www/brokerai/frontend`

### Files not updating
- Clear browser cache (Ctrl+Shift+Delete)
- Check VPS file timestamps: `ls -la /var/www/brokerai/frontend/assets/`

## Verify Deployment

```bash
ssh root@168.231.69.150
ls -la /var/www/brokerai/frontend/
ls -la /var/www/brokerai/frontend/assets/
exit
```

