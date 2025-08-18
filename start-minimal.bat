@echo off
title NFT Collection - Minimal Mode
color 0B
echo.
echo =====================================
echo    NFT Collection - Minimal Mode    
echo =====================================
echo.
echo This version uses only Node.js built-in modules
echo No npm install required!
echo.

cd /d "C:\Users\Демид\Documents\GitHub\Nft-collection-"

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js ready: %NODE_VERSION%

echo [2/3] Checking files...
if not exist "minimal-app.js" (
    echo ❌ minimal-app.js not found!
    pause
    exit /b 1
)
if not exist "public\index.html" (
    echo ❌ public\index.html not found!
    pause
    exit /b 1
)
echo ✅ Files ready

echo [3/3] Starting minimal server...
echo.
echo ⭐ Starting NFT Collection App (Minimal Mode)
echo 🌐 URL will be shown when server starts (auto-detects available port)
echo 📝 This version works without npm dependencies
echo 🔧 If port 3000 is busy, it will find the next available port
echo.
echo Press Ctrl+C to stop the server
echo.

node minimal-app.js

echo.
echo Server stopped.
pause
