# Frontend Deployment Script for VPS
# Deploys dist folder to /var/www/brokerai/frontend/

param(
    [string]$VPS_HOST = "168.231.69.150",
    [string]$VPS_USER = "root",
    [string]$VPS_PATH = "/var/www/brokerai/frontend",
    [switch]$SkipBuild = $false,
    [switch]$SkipUpload = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Frontend Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Step 1: Build Frontend
if (-not $SkipBuild) {
    Write-Host "`n📦 Building frontend..." -ForegroundColor Yellow
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed with exit code $LASTEXITCODE"
        }
        Write-Host "✅ Build completed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Build failed: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping build (--SkipBuild flag)" -ForegroundColor Yellow
}

# Step 2: Verify dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ dist folder not found!" -ForegroundColor Red
    exit 1
}

# Step 3: Upload to VPS
if (-not $SkipUpload) {
    Write-Host "`n📤 Uploading files to VPS..." -ForegroundColor Yellow
    Write-Host "   Host: $VPS_USER@$VPS_HOST" -ForegroundColor Gray
    Write-Host "   Path: $VPS_PATH" -ForegroundColor Gray
    
    try {
        # Upload dist folder contents
        scp -r dist/* "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"
        
        if ($LASTEXITCODE -ne 0) {
            throw "SCP upload failed"
        }
        
        Write-Host "✅ Files uploaded successfully" -ForegroundColor Green
        
        # Set permissions on VPS
        Write-Host "`n🔐 Setting permissions on VPS..." -ForegroundColor Yellow
        ssh "${VPS_USER}@${VPS_HOST}" "chown -R www-data:www-data $VPS_PATH && chmod -R 755 $VPS_PATH"
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Permission setting failed, but files were uploaded" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Permissions set successfully" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "❌ Upload failed: $_" -ForegroundColor Red
        Write-Host "`n💡 Make sure you have:" -ForegroundColor Yellow
        Write-Host "   1. SSH access configured (ssh key or password)" -ForegroundColor Gray
        Write-Host "   2. SCP installed (comes with OpenSSH)" -ForegroundColor Gray
        Write-Host "   3. Correct permissions to write to $VPS_PATH" -ForegroundColor Gray
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping upload (--SkipUpload flag)" -ForegroundColor Yellow
}

# Step 4: List uploaded files
Write-Host "`n📋 Uploaded files:" -ForegroundColor Cyan
Get-ChildItem -Path dist -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Resolve-Path dist).Path + "\", "")
    Write-Host "   $relativePath ($([math]::Round($_.Length / 1KB, 2)) KB)" -ForegroundColor Gray
}

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
Write-Host "   Frontend available at: https://www.brokerai.ai" -ForegroundColor Cyan

