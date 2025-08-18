# 🚨 Emergency Server - Инструкция по диагностике

## 🎯 Цель: Найти причину HTTP 500 ошибок

### 📋 Шаги диагностики:

#### 1. Запуск сервера
```batch
emergency.bat
```

#### 2. Что смотреть в консоли сервера:
- ✅ `EMERGENCY SERVER RUNNING` - сервер запустился
- 📥 `GET /api/health` - запросы приходят
- ❌ Любые ошибки или исключения

#### 3. Тестирование через браузер:
```
http://localhost:3000/emergency-test.html
```

#### 4. Результаты тестов:
- **Health check** - базовая работоспособность
- **Collection** - простой GET запрос  
- **Upload** - POST запрос с FormData
- **Main page** - загрузка HTML

### 🔍 Возможные проблемы и решения:

#### Если сервер не запускается:
- Порт 3000 занят: `netstat -ano | findstr :3000`
- Убить процесс: `taskkill /F /PID [номер]`

#### Если "Route not found":
- Консоль покажет точный URL
- Проверить доступные маршруты в ответе 404

#### Если HTTP 500:
- Консоль покажет stack trace
- Проверить синтаксис JavaScript

#### Если CORS ошибки:
- Заголовки уже настроены
- Проверить что Origin = localhost

### 📊 Ожидаемые результаты:

✅ **Успешный тест выглядит так:**
```
Health check SUCCESS: {"status":"ok","mode":"emergency"}
Upload SUCCESS: {"success":true,"data":{"name":"Emergency_NFT_..."}}
```

❌ **Проблемный тест:**
```
Health check FAILED: HTTP 500: Internal Server Error
Upload FAILED: Route not found
```

### 🚀 После диагностики:

1. **Если emergency работает** → проблема в сложной логике
2. **Если emergency НЕ работает** → проблема в базовой настройке

Готовы к тестированию! 🎯
