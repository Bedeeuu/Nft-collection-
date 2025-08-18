const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const responseContainer = document.getElementById('responseContainer');
const analyzeForm = document.getElementById('analyzeForm');
const questionInput = document.getElementById('questionInput');

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('customName', imageInput.value.split('\\').pop().split('.')[0]);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            responseContainer.innerHTML = `
                <h3>Upload Successful!</h3>
                <p>Name: ${data.data.name}</p>
                <p>Description: ${data.data.description}</p>
                <img src="${data.data.imageUrl}" alt="${data.data.name}" />
                <a href="${data.data.metadataUrl}" target="_blank">View Metadata</a>
            `;
        } else {
            responseContainer.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        responseContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

analyzeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const imageUrl = document.getElementById('imageUrl').value;
    const question = questionInput.value;

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl, question })
        });
        const data = await response.json();
        
        if (data.success) {
            responseContainer.innerHTML = `
                <h3>Analysis Result:</h3>
                <p>Question: ${data.data.question}</p>
                <p>Analysis: ${data.data.analysis}</p>
            `;
        } else {
            responseContainer.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        responseContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});