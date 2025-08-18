@echo off
echo 🚀 Запуск NFT Emergency Server...
echo.
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
echo Текущая папка: %CD%
echo.
if exist emergency-server.js (
    echo ✅ Файл emergency-server.js найден
    echo 🔄 Запускаем сервер...
    node emergency-server.js
) else (
    echo ❌ Файл emergency-server.js не найден!
    echo Содержимое папки:
    dir *.js
)
echo.
pause
