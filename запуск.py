#!/usr/bin/env python3
import os
import subprocess
import webbrowser
import time

print("🚀 Запуск NFT сервера через Python...")

# Переходим в нужную директорию
os.chdir(r"c:\Users\Демид\Documents\GitHub\Nft-collection-")
print(f"📂 Директория: {os.getcwd()}")

# Запускаем сервер
print("🚀 Запускаем Node.js сервер...")
try:
    # Запускаем сервер в фоне
    process = subprocess.Popen(['node', 'instant-server.js'], 
                              creationflags=subprocess.CREATE_NEW_CONSOLE)
    
    # Ждем немного
    print("⏰ Ждем 3 секунды...")
    time.sleep(3)
    
    # Открываем браузер
    print("🌐 Открываем браузер...")
    webbrowser.open('http://localhost:3000')
    
    print("✅ Сервер запущен! Браузер открыт.")
    print("💡 Для остановки сервера закройте окно консоли.")
    
    input("Нажмите Enter для выхода...")
    
except Exception as e:
    print(f"❌ Ошибка: {e}")
    input("Нажмите Enter для выхода...")
