@echo off
echo Проверяем Node.js...
node --version
if errorlevel 1 (
    echo Node.js не найден!
    pause
    exit
)

echo Переходим в папку...
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
echo Текущая папка: %CD%

echo Проверяем файл сервера...
if exist "instant-server.js" (
    echo Файл найден, запускаем...
    node instant-server.js
) else (
    echo Файл instant-server.js не найден!
    
    dir *.js
)
pause
