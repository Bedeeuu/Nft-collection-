@echo off
title ДИАГНОСТИКА NFT СЕРВЕРА
color 0E
echo.
echo ===============================================
echo    🔍 ДИАГНОСТИКА NFT СЕРВЕРА
echo ===============================================
echo.

echo 📂 Проверяем рабочую директорию...
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
if errorlevel 1 (
    echo ❌ ОШИБКА: Не удалось перейти в директорию проекта
    echo Путь: c:\Users\Демид\Documents\GitHub\Nft-collection-
    pause
    exit /b 1
)
echo ✅ Директория найдена: %CD%
echo.

echo 🔍 Проверяем Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ОШИБКА: Node.js не найден или не установлен
    echo.
    echo 💡 Решение:
    echo   1. Скачайте Node.js с https://nodejs.org
    echo   2. Установите его
    echo   3. Перезапустите эту программу
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js найден: %NODE_VERSION%
echo.

echo 🔍 Проверяем файл сервера...
if not exist "instant-server.js" (
    echo ❌ ОШИБКА: Файл instant-server.js не найден
    echo.
    echo 📋 Доступные файлы:
    dir *.js /b
    echo.
    pause
    exit /b 1
)
echo ✅ Файл instant-server.js найден
echo.

echo 🔍 Проверяем порт 3000...
netstat -an | find ":3000" >nul
if not errorlevel 1 (
    echo ⚠️ ВНИМАНИЕ: Порт 3000 уже занят
    echo.
    echo 💡 Решение:
    echo   1. Закройте другие программы, использующие порт 3000
    echo   2. Или нажмите Ctrl+C и попробуйте снова
    echo.
    pause
)

echo 🚀 Все проверки пройдены! Запускаем сервер...
echo.
echo ===============================================
echo    🚀 ЗАПУСК СЕРВЕРА
echo ===============================================
echo.

node instant-server.js
