# 🚀 МГНОВЕННЫЙ ЗАПУСК NFT СЕРВЕРА
Write-Host "===============================================" -ForegroundColor Green
Write-Host "    🚀 ЗАПУСК NFT СЕРВЕРА" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Переходим в нужную директорию
Set-Location "c:\Users\Демид\Documents\GitHub\Nft-collection-"
Write-Host "📂 Рабочая директория: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Проверяем Node.js
Write-Host "🔍 Проверяем Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js версия: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден!" -ForegroundColor Red
    pause
    exit
}

# Запускаем сервер
Write-Host "🚀 Запускаем сервер..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "instant-server.js" -WindowStyle Minimized -PassThru

# Ждем запуска
Write-Host "⏰ Ждем 3 секунды..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Открываем браузер
Write-Host "🌐 Открываем браузер..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ ГОТОВО!" -ForegroundColor Green
Write-Host "📋 Что произошло:" -ForegroundColor Cyan
Write-Host "  1. ✅ Сервер запущен в фоне" -ForegroundColor Green
Write-Host "  2. ✅ Браузер открыт автоматически" -ForegroundColor Green
Write-Host "  3. ✅ Готов к загрузке NFT" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Сервер работает в свернутом окне" -ForegroundColor Yellow
Write-Host "🔍 Проверьте браузер для работы с NFT" -ForegroundColor Yellow
Write-Host ""
Write-Host "Нажмите любую клавишу для выхода..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
