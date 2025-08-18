@echo off
title 📊 NFT СИСТЕМА - МОНИТОРИНГ
color 0B

:loop
cls
echo ===============================================
echo    📊 NFT СИСТЕМА - ТЕКУЩЕЕ СОСТОЯНИЕ
echo ===============================================
echo.
echo 📅 Время: %date% %time%
echo 📂 Директория: %CD%
echo.

echo 🟢 Node.js:
node --version 2>nul && echo ✅ Работает || echo ❌ Не найден
echo.

echo 🌐 Порт 3000:
netstat -an | find ":3000" >nul && echo ✅ Занят (сервер работает) || echo ❌ Свободен (сервер остановлен)
echo.

echo 📄 Файлы серверов:
if exist "instant-server.js" (echo ✅ instant-server.js) else (echo ❌ instant-server.js)
if exist "test-server.js" (echo ✅ test-server.js) else (echo ❌ test-server.js)
if exist "app.js" (echo ✅ app.js) else (echo ❌ app.js)
echo.

echo 📦 Зависимости:
if exist "node_modules" (echo ✅ node_modules) else (echo ❌ node_modules)
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json)
echo.

echo 🎮 Команды:
echo   T - Запустить тестовый сервер
echo   I - Запустить основной сервер  
echo   S - Остановить все серверы
echo   R - Обновить статус
echo   Q - Выход
echo.
echo Выберите действие:
choice /c TISRQ /n /m "> "

if errorlevel 5 goto :end
if errorlevel 4 goto :loop
if errorlevel 3 (
    echo Останавливаем серверы...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
    goto :loop
)
if errorlevel 2 (
    echo Запускаем основной сервер...
    start "NFT Server" cmd /c "node instant-server.js & pause"
    timeout /t 2 /nobreak >nul
    goto :loop
)
if errorlevel 1 (
    echo Запускаем тестовый сервер...
    start "Test Server" cmd /c "node test-server.js & pause"
    timeout /t 2 /nobreak >nul
    goto :loop
)

:end
echo До свидания!
