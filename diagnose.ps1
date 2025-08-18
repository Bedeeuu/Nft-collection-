Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "        NFT App Diagnostics" -ForegroundColor Cyan  
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\Демид\Documents\GitHub\Nft-collection-"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== CHECKING NODE.JS ===" -ForegroundColor Green
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js NOT FOUND" -ForegroundColor Red
        Write-Host "Please install from: https://nodejs.org" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Node.js NOT FOUND" -ForegroundColor Red
    Write-Host "Please install from: https://nodejs.org" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== CHECKING NPM ===" -ForegroundColor Green
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm is available: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm NOT FOUND" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ npm NOT FOUND" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== CHECKING FILES ===" -ForegroundColor Green
$files = @(
    @{name="simple-app.js"; required=$true},
    @{name="minimal-app.js"; required=$false},
    @{name="public\index.html"; required=$true},
    @{name="package.json"; required=$true},
    @{name="node_modules"; required=$false}
)

foreach ($file in $files) {
    if (Test-Path $file.name) {
        Write-Host "✅ $($file.name) found" -ForegroundColor Green
    } else {
        if ($file.required) {
            Write-Host "❌ $($file.name) missing" -ForegroundColor Red
        } else {
            Write-Host "⚠️ $($file.name) missing" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

Write-Host "=== TESTING SIMPLE NODE SCRIPT ===" -ForegroundColor Green
try {
    "console.log('Node.js test: OK');" | Out-File -FilePath "test-node.js" -Encoding UTF8
    $testResult = node test-node.js 2>$null
    if ($testResult -match "OK") {
        Write-Host "✅ Node.js execution works" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js execution failed" -ForegroundColor Red
    }
    Remove-Item "test-node.js" -ErrorAction SilentlyContinue
} catch {
    Write-Host "❌ Node.js execution failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== CHECKING PORTS ===" -ForegroundColor Green
try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Write-Host "⚠️ Port 3000 is already in use" -ForegroundColor Yellow
        Write-Host "Process using port 3000:" -ForegroundColor Yellow
        Get-Process -Id $port3000.OwningProcess | Select-Object Name, Id | Format-Table
    } else {
        Write-Host "✅ Port 3000 is available" -ForegroundColor Green
    }
} catch {
    Write-Host "✅ Port 3000 appears to be available" -ForegroundColor Green
}
Write-Host ""

Write-Host "=== RECOMMENDATIONS ===" -ForegroundColor Magenta
Write-Host ""
if (Test-Path "minimal-app.js") {
    Write-Host "🎯 RECOMMENDED: Run start-minimal.bat" -ForegroundColor Green
    Write-Host "   This version requires no dependencies" -ForegroundColor White
    Write-Host ""
    Write-Host "   Or run manually:" -ForegroundColor White
    Write-Host "   node minimal-app.js" -ForegroundColor Cyan
} elseif (Test-Path "node_modules") {
    Write-Host "🎯 RECOMMENDED: Run start-app-safe.bat" -ForegroundColor Green
    Write-Host "   Dependencies are installed" -ForegroundColor White
} else {
    Write-Host "🎯 First install dependencies:" -ForegroundColor Yellow
    Write-Host "   npm install" -ForegroundColor Cyan
    Write-Host "   Then run: start-app-safe.bat" -ForegroundColor White
}
Write-Host ""

Read-Host "Press Enter to close"
