@echo off
title NFT Collection App Launcher
color 0A
echo.
echo ========================================
echo     NFT Collection App Launcher
echo ========================================
echo.

cd /d "C:\Users\Демид\Documents\GitHub\Nft-collection-"

echo [1/4] Checking directory...
if not exist "simple-app.js" (
    echo ❌ simple-app.js not found!
    pause
    exit /b 1
)
echo ✅ Files found

echo [2/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js ready

echo [3/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)
echo ✅ Dependencies ready

echo [4/4] Starting app...
echo.
echo ⭐ Opening NFT Collection App...
echo 🌐 URL: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node simple-app.js

echo.
echo App stopped.
pause
