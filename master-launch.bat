@echo off
title NFT MASTER LAUNCHER
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"

echo ==============================================
echo   🎯 NFT COLLECTION - MASTER LAUNCHER
echo ==============================================
echo.
echo This script will:
echo 1. Check if port 3000 is free
echo 2. Start emergency server
echo 3. Open test page automatically
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo 🔍 Checking port 3000...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel%==0 (
    echo ⚠️  Port 3000 is busy. Trying to clear it...
    call clear-port-3000.bat
) else (
    echo ✅ Port 3000 is free
)

echo.
echo 🚀 Starting emergency server...
echo.
echo Server console will open in a new window.
echo After server starts, test page will open automatically.
echo.

REM Start server in new window
start "NFT Emergency Server" cmd /c "emergency.bat"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

echo 🌐 Opening test page...
start http://localhost:3000/emergency-test.html

echo.
echo 📋 Instructions:
echo 1. Check the server console window for any errors
echo 2. In the test page, run all tests
echo 3. Report results back
echo.
echo ✅ Master launcher completed!
echo.
pause
