@echo off
echo 🔍 БЫСТРАЯ ПРОВЕРКА...
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"

echo Проверяем Node.js:
node --version && echo ✅ Node.js работает || echo ❌ Node.js не найден

echo.
echo Проверяем файлы:
if exist "instant-server.js" (echo ✅ instant-server.js найден) else (echo ❌ instant-server.js не найден)
if exist "package.json" (echo ✅ package.json найден) else (echo ❌ package.json не найден)

echo.
echo Проверяем порт 3000:
netstat -an | find ":3000" >nul && echo ⚠️ Порт занят || echo ✅ Порт свободен

echo.
echo 🚀 Запускаем тестовый сервер...
start "Test Server" /min cmd /c "node test-server.js"

echo ⏰ Ждем 3 секунды...
timeout /t 3 /nobreak >nul

echo 🌐 Открываем браузер...
start http://localhost:3000

echo.
echo ✅ ПРОВЕРКА ЗАВЕРШЕНА!
echo Проверьте браузер - должна появиться страница "NFT Сервер работает!"
pause
