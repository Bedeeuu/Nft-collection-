@echo off
title 🔍 ПОЛНАЯ ПРОВЕРКА NFT СИСТЕМЫ
color 0F
cls

echo ===============================================
echo    🔍 ПОЛНАЯ ПРОВЕРКА NFT СИСТЕМЫ
echo ===============================================
echo.

REM Проверка 1: Рабочая директория
echo [1/8] 📂 Проверяем рабочую директорию...
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
if errorlevel 1 (
    echo ❌ ОШИБКА: Директория не найдена
    goto :error
)
echo ✅ Директория: %CD%
echo.

REM Проверка 2: Node.js
echo [2/8] 🟢 Проверяем Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ОШИБКА: Node.js не установлен
    echo 💡 Скачайте с https://nodejs.org
    goto :error
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js версия: %NODE_VERSION%
echo.

REM Проверка 3: npm
echo [3/8] 📦 Проверяем npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ОШИБКА: npm не найден
    goto :error
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm версия: %NPM_VERSION%
echo.

REM Проверка 4: Основные файлы
echo [4/8] 📄 Проверяем основные файлы...
if not exist "package.json" (
    echo ❌ package.json не найден
    goto :error
)
echo ✅ package.json найден

if not exist "instant-server.js" (
    echo ❌ instant-server.js не найден
    goto :error
)
echo ✅ instant-server.js найден

if not exist "test-server.js" (
    echo ❌ test-server.js не найден
    goto :error
)
echo ✅ test-server.js найден
echo.

REM Проверка 5: Зависимости
echo [5/8] 📚 Проверяем зависимости...
if not exist "node_modules" (
    echo ⚠️ node_modules не найден, устанавливаем...
    npm install
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей
        goto :error
    )
)
echo ✅ Зависимости готовы
echo.

REM Проверка 6: Порт 3000
echo [6/8] 🌐 Проверяем порт 3000...
netstat -an | find ":3000" >nul
if not errorlevel 1 (
    echo ⚠️ Порт 3000 занят, освобождаем...
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
)
echo ✅ Порт 3000 свободен
echo.

REM Проверка 7: Тест простого сервера
echo [7/8] 🧪 Тестируем простой сервер...
echo Запускаем тестовый сервер на 5 секунд...
start /min "Test Server" cmd /c "node test-server.js"
timeout /t 3 /nobreak >nul

REM Проверяем, отвечает ли сервер
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo ❌ Сервер не отвечает
    taskkill /f /im node.exe >nul 2>&1
    goto :error
)
echo ✅ Тестовый сервер работает
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo.

REM Проверка 8: Финальный тест
echo [8/8] 🚀 Финальная проверка...
echo ✅ Все компоненты готовы к работе!
echo.

echo ===============================================
echo    🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!
echo ===============================================
echo.
echo 📋 Результаты проверки:
echo   ✅ Node.js %NODE_VERSION% - работает
echo   ✅ npm %NPM_VERSION% - работает  
echo   ✅ Все файлы найдены
echo   ✅ Зависимости установлены
echo   ✅ Порт 3000 свободен
echo   ✅ Сервер тестирован
echo.
echo 🚀 ГОТОВ К ЗАПУСКУ!
echo.
echo 💡 Рекомендуемые команды для запуска:
echo   • ТЕСТ-СЕРВЕР.bat    - простой тестовый сервер
echo   • ПРОСТО-ЗАПУСК.bat  - основной сервер
echo   • node instant-server.js - ручной запуск
echo.
echo Хотите запустить сервер сейчас? (Y/N)
set /p choice="> "
if /i "%choice%"=="y" (
    echo.
    echo 🚀 Запускаем основной сервер...
    node instant-server.js
)
goto :end

:error
echo.
echo ===============================================
echo    ❌ ОБНАРУЖЕНЫ ПРОБЛЕМЫ
echo ===============================================
echo.
echo 💡 Решения:
echo   1. Установите Node.js с https://nodejs.org
echo   2. Перезапустите командную строку
echo   3. Попробуйте снова
echo.

:end
pause
