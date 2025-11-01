@echo off
REM Frontend Deployment Script for VPS (Batch version)
REM Usage: deploy-frontend.bat

echo.
echo ========================================
echo  Frontend Deployment to VPS
echo ========================================
echo.

REM Step 1: Build
echo [1/3] Building frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Build complete!
echo.

REM Step 2: Upload
echo [2/3] Uploading to VPS...
scp -r dist/* root@168.231.69.150:/var/www/brokerai/frontend/
if %ERRORLEVEL% neq 0 (
    echo Upload failed!
    pause
    exit /b 1
)
echo Upload complete!
echo.

REM Step 3: Set permissions
echo [3/3] Setting permissions...
ssh root@168.231.69.150 "chown -R www-data:www-data /var/www/brokerai/frontend && chmod -R 755 /var/www/brokerai/frontend"
if %ERRORLEVEL% neq 0 (
    echo Permission update failed (but files were uploaded)
) else (
    echo Permissions set!
)
echo.

echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
pause

