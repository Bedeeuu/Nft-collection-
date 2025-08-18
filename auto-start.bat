@echo off
title NFT Emergency Server - AUTO START
color 0A
echo.
echo ================================================
echo    🚀 NFT EMERGENCY SERVER - AUTO START
echo ================================================
echo.
echo Переходим в папку проекта...
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"

echo ✅ Текущая папка: %CD%
echo.

echo 🔍 Проверяем наличие файлов...
if exist emergency-server.js (
    echo ✅ emergency-server.js найден
) else (
    echo ❌ emergency-server.js НЕ найден!
    echo 📂 Содержимое папки:
    dir *.js
    echo.
    echo ⚠️  Создаём файл emergency-server.js...
    goto CREATE_FILE
)

echo.
echo 🚀 Запускаем emergency сервер...
echo ⏰ Время запуска: %TIME%
echo 🌐 Сервер будет доступен на: http://localhost:3000
echo 📋 Тест-страница: http://localhost:3000/emergency-test.html
echo.
echo =============== ЛОГИ СЕРВЕРА ===============
node emergency-server.js
goto END

:CREATE_FILE
echo const http = require('http');> emergency-server.js
echo const fs = require('fs');>> emergency-server.js
echo const path = require('path');>> emergency-server.js
echo console.log('🔧 Emergency server created and starting...');>> emergency-server.js
echo const server = http.createServer((req, res) =^> {>> emergency-server.js
echo   res.setHeader('Access-Control-Allow-Origin', '*');>> emergency-server.js
echo   if (req.url === '/') {>> emergency-server.js
echo     res.writeHead(200, {'Content-Type': 'text/html'});>> emergency-server.js
echo     res.end('^<h1^>Emergency Server Works!^</h1^>');>> emergency-server.js
echo   } else {>> emergency-server.js
echo     res.writeHead(404, {'Content-Type': 'application/json'});>> emergency-server.js
echo     res.end('{"error":"Route not found"}');>> emergency-server.js
echo   }>> emergency-server.js
echo });>> emergency-server.js
echo server.listen(3000, () =^> console.log('Server running on port 3000'));>> emergency-server.js
echo ✅ emergency-server.js создан!
echo 🚀 Запускаем сервер...
node emergency-server.js

:END
echo.
echo ===============================================
echo Server stopped. Press any key to exit...
pause >nul
