@echo off
title INSTANT NFT SERVER
color 0B
echo.
echo =============================================
echo      🚀 INSTANT NFT SERVER
echo =============================================
echo.
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
echo 📂 Working in: %CD%
echo.
echo 🚀 Starting instant server...
echo ⚡ This server will start IMMEDIATELY
echo 🌐 URL: http://localhost:3000
echo.

node instant-server.js

echo.
echo Server stopped.
pause
