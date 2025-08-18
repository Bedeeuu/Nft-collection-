Write-Host "🚀 Starting NFT Collection App..." -ForegroundColor Green
Set-Location "C:\Users\Демид\Documents\GitHub\Nft-collection-"
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Cyan

Write-Host "🔍 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "🔍 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found." -ForegroundColor Red
}

Write-Host "🚀 Starting simple NFT app..." -ForegroundColor Green
Write-Host "🌐 Open your browser to: http://localhost:3000" -ForegroundColor Magenta

try {
    node simple-app.js
} catch {
    Write-Host "❌ Error starting app: $_" -ForegroundColor Red
}

Read-Host "Press Enter to close"
