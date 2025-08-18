@echo off
title 🚀 NFT СИСТЕМА - ПОЛНЫЙ ЗАПУСК
color 0A
cls

echo ===============================================
echo    🚀 NFT СИСТЕМА - ПОЛНЫЙ ЗАПУСК
echo ===============================================
echo.

echo [1] 📂 Переходим в рабочую директорию...
cd /d "c:\Users\Демид\Documents\GitHub\Nft-collection-"
echo ✅ Директория: %CD%
echo.

echo [2] 🌐 Открываем страницу мониторинга...
start "Мониторинг NFT" "статус.html"
timeout /t 2 /nobreak >nul

echo [3] 🚀 Запускаем тестовый сервер...
start "NFT Test Server" /min cmd /c "echo 🚀 Запуск NFT тестового сервера... & node test-server.js & echo. & echo Сервер остановлен. Нажмите любую клавишу... & pause"
timeout /t 3 /nobreak >nul

echo [4] 🌐 Открываем NFT приложение...
start http://localhost:3000
timeout /t 2 /nobreak >nul

echo.
echo ✅ ЗАПУСК ЗАВЕРШЕН!
echo.
echo 📋 Что открылось:
echo   🖥️ Страница мониторинга статуса
echo   🚀 NFT сервер в отдельном окне  
echo   🌐 NFT приложение в браузере
echo.
echo 💡 Если что-то не работает:
echo   • Проверьте страницу мониторинга
echo   • Запустите ПОЛНАЯ-ПРОВЕРКА.bat для диагностики
echo.
echo Нажмите любую клавишу для выхода...
pause >nul
