@echo off
title AUTO NFT SERVER + BROWSER
color 0A
echo.
echo ===============================================
echo    🚀 AUTO NFT SERVER + BROWSER LAUNCHER
echo ===============================================
echo.
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
echo 📂 Working directory: %CD%
echo.

echo 🚀 Starting server in background...
start /min "NFT Server" cmd /c "node server\instant-server.js"

echo ⏰ Waiting 2 seconds for server to start...
timeout /t 2 /nobreak >nul

echo 🌐 Opening browser...
start http://localhost:3000

echo.
echo ✅ COMPLETE! 
echo.
echo 📋 What happened:
echo   1. ✅ Server started in background
echo   2. ✅ Browser opened automatically
echo   3. ✅ Ready to test NFT creation
echo.
echo 💡 Server is running in minimized window
echo 🔍 Check browser for the NFT app
echo.
pause