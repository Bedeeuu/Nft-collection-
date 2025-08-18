@echo off
title NFT App Diagnostics
echo.
echo =======================================
echo        NFT App Diagnostics
echo =======================================
echo.

cd /d "C:\Users\Демид\Documents\GitHub\Nft-collection-"
echo Current directory: %CD%
echo.

echo === CHECKING NODE.JS ===
node --version 2>nul
if errorlevel 1 (
    echo ❌ Node.js NOT FOUND
    echo Please install from: https://nodejs.org
) else (
    echo ✅ Node.js is installed
)
echo.

echo === CHECKING NPM ===
npm --version 2>nul
if errorlevel 1 (
    echo ❌ npm NOT FOUND
) else (
    echo ✅ npm is available
)
echo.

echo === CHECKING FILES ===
if exist "simple-app.js" (echo ✅ simple-app.js found) else (echo ❌ simple-app.js missing)
if exist "minimal-app.js" (echo ✅ minimal-app.js found) else (echo ❌ minimal-app.js missing)
if exist "public\index.html" (echo ✅ public\index.html found) else (echo ❌ public\index.html missing)
if exist "package.json" (echo ✅ package.json found) else (echo ❌ package.json missing)
if exist "node_modules" (echo ✅ node_modules found) else (echo ⚠️ node_modules missing - run npm install)
echo.

echo === TESTING SIMPLE NODE SCRIPT ===
echo console.log("Node.js test: OK"); > test-node.js
node test-node.js 2>nul
if errorlevel 1 (
    echo ❌ Node.js execution failed
) else (
    echo ✅ Node.js execution works
)
del test-node.js 2>nul
echo.

echo === RECOMMENDATIONS ===
echo.
if exist "minimal-app.js" (
    echo 🎯 RECOMMENDED: Run start-minimal.bat
    echo    This version requires no dependencies
) else (
    echo 🎯 Install dependencies first: npm install
    echo    Then run: start-app-safe.bat
)
echo.

pause
