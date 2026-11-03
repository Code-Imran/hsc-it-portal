@echo off
title Deploying IT PORTAL
echo 🚀 Updating IT PORTAL...

echo.
echo 📦 [1/3] Building Astro...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Astro build failed. Check the errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo ☁️ [2/3] Deploying via Wrangler...
call npx wrangler deploy
if %errorlevel% neq 0 (
    echo ❌ Wrangler deploy failed. Make sure you are logged in.
    pause
    exit /b %errorlevel%
)

echo.
echo 🔄 [3/3] Syncing to GitHub (Code-Imran/hsc-it-portal)...
git add .
git commit -m "IT PORTAL Update: %date% %time%"
git push origin main

echo.
echo ======================================================
echo 🎉 SUCCESS! 
echo ⚡ Live at: https://hsc-it-portal.imranshaikh.workers.dev/
echo ======================================================
pause