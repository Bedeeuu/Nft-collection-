const fs = require('fs');
const path = require('path');

// Функция для анализа изображения
function analyzeImage(imagePath) {
    // Проверяем существование файла
    if (!fs.existsSync(imagePath)) {
        throw new Error('Изображение не найдено');
    }

    // Читаем изображение
    const imageBuffer = fs.readFileSync(imagePath);
    // Здесь можно добавить логику для анализа изображения
    // Например, конвертация в base64 или отправка на OpenAI API

    return imageBuffer;
}

// Функция для подготовки изображения для отправки на OpenAI
function prepareImageForOpenAI(imagePath) {
    const imageBuffer = analyzeImage(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageExtension = path.extname(imagePath).toLowerCase();
    const mimeType = imageExtension === '.png' ? 'image/png' : 'image/jpeg';

    return {
        base64: base64Image,
        mimeType: mimeType
    };
}

module.exports = {
    analyzeImage,
    prepareImageForOpenAI
};