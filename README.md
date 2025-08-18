# 🎨 NFT Collection Generator

[![Deploy Status](https://github.com/Bedeeuu/Nft-collection-/actions/workflows/deploy.yml/badge.svg)](https://github.com/Bedeeuu/Nft-collection-/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Полнофункциональное веб-приложение для создания NFT коллекций с использованием ИИ для генерации описаний. Поддерживает загрузку в GitHub, IPFS и интеграцию с Telegram ботом.

## ✨ Возможности

### 🌐 Веб-интерфейс
- **Drag & Drop загрузка** изображений
- **ИИ-генерация описаний** через Hugging Face
- **Автоматическое создание метаданных** NFT
- **Интерактивный анализ** изображений
- **Просмотр коллекции** в реальном времени

### 🤖 Telegram Bot
- Загрузка изображений через Telegram
- Генерация описаний с помощью VLM моделей
- Интерактивные вопросы об изображениях
- Автоматическая загрузка в GitHub

### 🔗 Интеграции
- **GitHub** - хранение изображений и метаданных
- **Hugging Face** - ИИ модели для описаний
- **IPFS (NFT.Storage)** - децентрализованное хранение
- **GitHub Actions** - автоматический деплой

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/Bedeeuu/Nft-collection-.git
cd Nft-collection-
```

### 2. Настройка окружения
```bash
# Скопируйте файл примера
cp .env.example .env

# Отредактируйте .env файл с вашими токенами
```

### 3. Веб-приложение (Node.js)
```bash
# Установите зависимости
npm install

# Запустите сервер разработки
npm run dev

# Или продакшн сервер
npm start
```

Откройте http://localhost:3000

### 4. Telegram Bot (Python)
```bash
# Установите Python зависимости
pip install -r requirements.txt

# Запустите бота
python bot_main_hf_github.py
```

## 📁 Структура проекта

```
├── 📱 Веб-приложение
│   ├── app.js              # Express.js сервер
│   ├── package.json        # Node.js зависимости
│   └── public/
│       └── index.html      # Веб-интерфейс
│
├── 🤖 Telegram Bots
│   ├── bot_main_hf_github.py           # Основной бот
│   └── bot_main_git_upload_and_watch.py # Расширенный бот
│
├── 📝 Скрипты
│   ├── scripts/
│   │   ├── generate_descriptions.py    # Генерация описаний
│   │   └── generate_caption.py         # Создание подписей
│   └── requirements.txt                # Python зависимости
│
├── 🗂️ Данные
│   ├── images/             # Изображения NFT
│   ├── descriptions/       # Метаданные
│   └── metadata/           # JSON метаданные
│
└── ⚙️ Конфигурация
    ├── .github/workflows/  # GitHub Actions
    ├── .env.example        # Пример конфигурации
    └── README.md          # Документация
```

## 🔧 Конфигурация

### Обязательные переменные окружения:
```env
# Telegram
TELEGRAM_TOKEN=your_telegram_bot_token

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_REPO=username/repository

# Hugging Face
HF_TOKEN=your_huggingface_token
```

### Опциональные переменные:
```env
# IPFS
NFT_STORAGE_KEY=your_nft_storage_key

# Сервер
PORT=3000
NODE_ENV=production
```

## 🌐 API Endpoints

### `POST /api/upload`
Загрузка и обработка изображения
```json
{
  "success": true,
  "data": {
    "name": "NFT_12345678",
    "description": "AI generated description...",
    "imageUrl": "https://raw.githubusercontent.com/...",
    "metadataUrl": "https://raw.githubusercontent.com/...",
    "metadata": { ... },
    "ipfs": { ... }
  }
}
```

### `POST /api/analyze`
Анализ изображения с помощью ИИ
```json
{
  "imageUrl": "https://...",
  "question": "What colors are in this image?"
}
```

### `GET /api/collection`
Получение коллекции NFT
```json
{
  "success": true,
  "data": {
    "totalImages": 42,
    "images": [ ... ]
  }
}
```

### `GET /api/health`
Проверка состояния сервисов

## 🎯 Функции ИИ

### Генерация описаний
- **Базовые подписи**: `nlpconnect/vit-gpt2-image-captioning`
- **Детальные описания**: `microsoft/DialoGPT-medium`
- **Visual Language Model**: `HuggingFaceTB/SmolVLM-Instruct`

### Анализ изображений
- Ответы на произвольные вопросы об изображении
- Анализ цветов, стиля, настроения
- Описание композиции и элементов

## 🚀 Деплой

### GitHub Pages (автоматически)
Приложение автоматически деплоится на GitHub Pages при push в main ветку.

### Heroku
```bash
# Настройте Heroku secrets в GitHub
HEROKU_API_KEY=your_heroku_api_key
HEROKU_APP_NAME=your_app_name
HEROKU_EMAIL=your_email
```

### Локальный деплой
```bash
# Сборка для продакшна
npm run build

# Запуск продакшн сервера
npm start
```

## 🤖 Команды Telegram бота

- `/start` - Запуск бота и главное меню
- `/ask [вопрос]` - Задать вопрос об изображении  
- `/caption <url>` - Описать изображение по ссылке
- `/rebuild` - Сгенерировать новое описание
- `/mint` - Загрузить в IPFS для минтинга

## 🔒 Безопасность

- Валидация типов файлов
- Ограничение размера файлов (10MB)
- Защита от XSS и инъекций
- Rate limiting для API
- Шифрование токенов в GitHub Secrets

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📋 Roadmap

- [ ] **Поддержка видео NFT**
- [ ] **Интеграция с OpenSea**
- [ ] **Социальные функции**
- [ ] **Мобильное приложение**
- [ ] **Blockchain интеграция**
- [ ] **Marketplace интеграция**

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. [LICENSE](LICENSE) файл.

## 💬 Поддержка

- **Issues**: [GitHub Issues](https://github.com/Bedeeuu/Nft-collection-/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Bedeeuu/Nft-collection-/discussions)
- **Telegram**: [@your_support_bot](https://t.me/your_support_bot)

## 🙏 Благодарности

- [Hugging Face](https://huggingface.co/) - ИИ модели
- [NFT.Storage](https://nft.storage/) - IPFS хранение
- [GitHub](https://github.com/) - хостинг кода и данных
- [Telegram](https://telegram.org/) - Bot API

---

**⭐ Поставьте звезду, если проект был полезен!**
