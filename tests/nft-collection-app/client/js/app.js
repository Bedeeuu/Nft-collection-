// filepath: nft-collection-app/client/js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const imageInput = document.getElementById('image-input');
    const resultContainer = document.getElementById('result-container');

    generateButton.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert('Пожалуйста, выберите изображение для анализа.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/generate-description', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при генерации описания.');
            }

            const data = await response.json();
            displayResult(data);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при обработке изображения.');
        }
    });

    function displayResult(data) {
        resultContainer.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <p><strong>Стиль:</strong> ${data.style}</p>
            <p><strong>Цветовая палитра:</strong> ${data.colors}</p>
            <p><strong>Настроение:</strong> ${data.mood}</p>
            <p><strong>Атрибуты:</strong> ${data.attributes.join(', ')}</p>
        `;
    }
});