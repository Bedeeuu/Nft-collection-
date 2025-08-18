@echo off
title ЭКСТРЕННЫЙ ЗАПУСК NFT
color 0B
echo.
echo ===============================================
echo    🚨 ЭКСТРЕННЫЙ ЗАПУСК NFT СЕРВЕРА
echo ===============================================
echo.

REM Переходим в директорию проекта
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
if errorlevel 1 (
    echo ❌ Ошибка: Не удалось перейти в директорию проекта
    pause
    exit /b 1
)

echo 📂 Текущая директория: %CD%
echo.

REM Проверяем Node.js
echo 🔍 Проверяем Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден! Установите Node.js
    pause
    exit /b 1
)
echo ✅ Node.js найден

REM Проверяем файл сервера
if not exist "instant-server.js" (
    echo ❌ Файл instant-server.js не найден!
    pause
    exit /b 1
)
echo ✅ Файл сервера найден

echo.
echo 🚀 ЗАПУСКАЕМ СЕРВЕР...
echo.

REM Запускаем сервер
start "NFT Server" /min cmd /c "node instant-server.js & pause"

REM Ждем
echo ⏰ Ждем 3 секунды для запуска сервера...
timeout /t 3 /nobreak >nul

REM Открываем браузер
echo 🌐 Открываем браузер...
start http://localhost:3000

echo.
echo ✅ СЕРВЕР ЗАПУЩЕН!
echo.
echo 📋 Что сделано:
echo   ✅ Сервер запущен в отдельном окне
echo   ✅ Браузер открыт на http://localhost:3000
echo   ✅ Готов к загрузке NFT файлов
echo.
echo 💡 Если браузер не открылся, перейдите на:
echo    http://localhost:3000
echo.
echo 🔧 Для остановки сервера закройте окно "NFT Server"
echo.
pause
