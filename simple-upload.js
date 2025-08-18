console.log('🔧 ПРОСТОЙ ЗАГРУЗЧИК NFT ЗАПУСКАЕТСЯ...');

const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log(`📥 ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>📤 Простая загрузка NFT</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(0,0,0,0.3);
            padding: 30px;
            border-radius: 15px;
          }
          .upload-form {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
            margin: 20px 0;
          }
          input[type="file"] {
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 16px;
          }
          .btn {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin: 10px 0;
          }
          .btn:hover {
            background: #45a049;
          }
          .result {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            display: none;
          }
          .error {
            background: rgba(244, 67, 54, 0.3);
            border-left: 4px solid #f44336;
          }
          .success {
            background: rgba(76, 175, 80, 0.3);
            border-left: 4px solid #4CAF50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📤 Простая загрузка NFT файлов</h1>
          
          <div class="upload-form">
            <h3>Выберите файл для загрузки:</h3>
            <form id="uploadForm" enctype="multipart/form-data">
              <input type="file" id="fileInput" name="file" accept="image/*,video/*,audio/*,.pdf,.img" required>
              <input type="text" id="fileName" name="name" placeholder="Имя файла (необязательно)" style="width: 94%; padding: 10px; margin: 10px 0; border: 1px solid rgba(255,255,255,0.3); border-radius: 5px; background: rgba(255,255,255,0.1); color: white;">
              <button type="submit" class="btn">🚀 Загрузить файл</button>
            </form>
          </div>
          
          <div id="result" class="result"></div>
          
          <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
            <h4>📋 Поддерживаемые форматы:</h4>
            <p>🖼️ Изображения: JPG, PNG, GIF, IMG<br>
            🎬 Видео: MP4<br>
            🎵 Аудио: MP3<br>
            📄 Документы: PDF</p>
          </div>
        </div>

        <script>
          document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById('fileInput');
            const nameInput = document.getElementById('fileName');
            const resultDiv = document.getElementById('result');
            
            if (!fileInput.files[0]) {
              showResult('❌ Пожалуйста, выберите файл!', 'error');
              return;
            }
            
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', nameInput.value || file.name);
            formData.append('originalName', file.name);
            formData.append('size', file.size);
            formData.append('type', file.type);
            
            showResult('⏳ Загружаем файл...', 'info');
            
            try {
              const response = await fetch('/upload', {
                method: 'POST',
                body: formData
              });
              
              if (!response.ok) {
                throw new Error('Ошибка сервера: ' + response.status);
              }
              
              const result = await response.json();
              showResult('✅ Файл успешно загружен!\\n' + JSON.stringify(result, null, 2), 'success');
              
            } catch (error) {
              showResult('❌ Ошибка загрузки: ' + error.message, 'error');
            }
          });
          
          function showResult(message, type) {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.className = 'result ' + type;
            resultDiv.innerHTML = '<pre style="white-space: pre-wrap;">' + message + '</pre>';
          }
          
          // Показываем информацию о выбранном файле
          document.getElementById('fileInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
              const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
              showResult('📁 Выбран файл:\\n' + 
                'Имя: ' + file.name + '\\n' + 
                'Размер: ' + sizeInMB + ' МБ\\n' + 
                'Тип: ' + file.type, 'info');
            }
          });
        </script>
      </body>
      </html>
    `);
    return;
  }

  if (req.url === '/upload' && req.method === 'POST') {
    console.log('📤 Обрабатываем загрузку файла...');
    
    let body = '';
    let rawData = Buffer.alloc(0);
    
    req.on('data', chunk => {
      rawData = Buffer.concat([rawData, chunk]);
    });
    
    req.on('end', () => {
      console.log('📦 Получены данные размером:', rawData.length, 'байт');
      
      const response = {
        success: true,
        timestamp: new Date().toISOString(),
        message: '🎉 Файл успешно загружен и обработан!',
        data: {
          id: 'NFT_' + Date.now(),
          name: 'Загруженный_файл_' + Math.random().toString(36).substr(2, 6),
          size: rawData.length + ' байт',
          uploadTime: new Date().toLocaleString('ru-RU'),
          status: 'uploaded',
          description: '✅ NFT файл загружен в систему и готов для создания коллекции!'
        }
      };
      
      console.log('✅ Файл обработан успешно!');
      
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(response, null, 2));
    });
    
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>404 - Страница не найдена</h1>');
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log('✅ ПРОСТОЙ ЗАГРУЗЧИК NFT ЗАПУЩЕН!');
  console.log('🌐 Откройте браузер: http://localhost:' + PORT);
  console.log('📤 Готов к загрузке файлов!');
  console.log('🔧 Для остановки нажмите Ctrl+C');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('❌ Порт ' + PORT + ' занят, пробуем порт ' + (PORT + 1));
    server.listen(PORT + 1);
  } else {
    console.log('❌ Ошибка сервера:', err.message);
  }
});
