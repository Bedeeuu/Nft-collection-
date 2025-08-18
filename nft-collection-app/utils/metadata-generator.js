const fs = require('fs');
const path = require('path');

// Функция для генерации метаданных NFT
function generateMetadata(name, description, style, colors, mood, attributes) {
    return {
        name: name,
        description: description,
        style: style,
        colors: colors,
        mood: mood,
        attributes: attributes
    };
}

// Функция для сохранения метаданных в файл
function saveMetadataToFile(metadata, filePath) {
    const jsonMetadata = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(filePath, jsonMetadata, 'utf8');
}

// Функция для загрузки метаданных из файла
function loadMetadataFromFile(filePath) {
    if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
    }
    return null;
}

// Экспортируем функции
module.exports = {
    generateMetadata,
    saveMetadataToFile,
    loadMetadataFromFile
};