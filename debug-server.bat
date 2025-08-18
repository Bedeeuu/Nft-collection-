@echo off
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
echo ========================================
echo   🚀 NFT Collection Server - Debug Mode
echo ========================================
echo.
echo 📁 Working directory: %CD%
echo 🕐 Starting time: %DATE% %TIME%
echo.
echo Starting minimal server with detailed logging...
echo Server will be available at: http://localhost:3000
echo.
echo ⚠️  If you see errors, check the console output below:
echo ========================================
echo.

node minimal-app.js

echo.
echo ========================================
echo Server stopped. Check above for any errors.
echo Press any key to close this window...
pause >nul
