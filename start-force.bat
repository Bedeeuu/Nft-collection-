@echo off
title NFT Collection - Force Start
color 0C
echo.
echo ========================================
echo   NFT Collection - Force Restart    
echo ========================================
echo.

cd /d "C:\Users\Демид\Documents\GitHub\Nft-collection-"

echo [1/4] Killing existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Previous processes stopped

echo [2/4] Waiting for port to be free...
timeout /t 2 >nul
echo ✅ Ready to start

echo [3/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    pause
    exit /b 1
)
echo ✅ Node.js ready

echo [4/4] Starting fresh server...
echo.
echo ⭐ Starting NFT Collection App (Clean Start)
echo 🌐 Will automatically find available port
echo 📝 All previous instances stopped
echo.
echo Press Ctrl+C to stop the server
echo.

node minimal-app.js

echo.
echo Server stopped.
pause
