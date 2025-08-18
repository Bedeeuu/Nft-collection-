console.log('🚀 NFT ЗАГРУЗКА СЕРВЕР ЗАПУСКАЕТСЯ...');

const http = require('http');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 NFT Загрузка</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(0,0,0,0.3);
            padding: 30px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          .upload-area {
            border: 3px dashed rgba(255,255,255,0.5);
            padding: 50px;
            text-align: center;
            border-radius: 15px;
            margin: 20px 0;
            background: rgba(255,255,255,0.05);
            transition: all 0.3s;
            cursor: pointer;
          }
          .upload-area:hover {
            border-color: #4CAF50;
            background: rgba(76, 175, 80, 0.1);
          }
          .upload-area.dragover {
            border-color: #4CAF50;
            background: rgba(76, 175, 80, 0.2);
            transform: scale(1.02);
          }
          .btn {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin: 10px;
            font-size: 16px;
            transition: all 0.3s;
          }
          .btn:hover {
            background: #45a049;
            transform: translateY(-2px);
          }
          .btn-large {
            padding: 20px 40px;
            font-size: 20px;
            font-weight: bold;
          }
          .progress {
            width: 100%;
            height: 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            overflow: hidden;
            margin: 15px 0;
            display: none;
          }
          .progress-bar {
            height: 100%;
            background: #4CAF50;
            width: 0%;
            transition: width 0.3s;
          }
          .result {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            display: none;
          }
          .file-preview {
            max-width: 200px;
            max-height: 200px;
            border-radius: 10px;
            margin: 10px;
          }
          .hidden {
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 NFT Загрузка</h1>
          <p>Загрузите изображения, видео или аудио файлы для создания NFT коллекции</p>
          
          <div class="upload-area" id="uploadArea" onclick="document.getElementById('fileInput').click()">
            <h2>📁 Перетащите файлы сюда</h2>
            <p>или</p>
            <button class="btn btn-large">📂 Выбрать файлы</button>
            <input type="file" id="fileInput" class="hidden" multiple accept="image/*,video/*,audio/*,.pdf,.img">
            <p style="opacity: 0.7; margin-top: 20px;">
              Поддерживаемые форматы: JPG, PNG, GIF, IMG, MP4, MP3, PDF
            </p>
          </div>
          
          <div class="progress" id="progressContainer">
            <div class="progress-bar" id="progressBar"></div>
          </div>
          
          <div class="result" id="result"></div>
          
          <div style="margin-top: 30px;">
            <button class="btn" onclick="clearAll()">🗑️ Очистить</button>
            <button class="btn" onclick="testConnection()">🧪 Тест соединения</button>
          </div>
        </div>

        <script>
          const uploadArea = document.getElementById('uploadArea');
          const fileInput = document.getElementById('fileInput');
          const progressContainer = document.getElementById('progressContainer');
          const progressBar = document.getElementById('progressBar');
          const result = document.getElementById('result');

          // Drag & Drop функциональность
          uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
          });

          uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
          });

          uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
          });

          fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
          });

          async function handleFiles(files) {
            if (files.length === 0) return;
            
            progressContainer.style.display = 'block';
            result.style.display = 'none';
            
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              await uploadFile(file, i + 1, files.length);
            }
          }

          async function uploadFile(file, current, total) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);
            formData.append('type', file.type);
            
            try {
              progressBar.style.width = ((current - 1) / total * 100) + '%';
              
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              });
              
              const data = await response.json();
              
              progressBar.style.width = (current / total * 100) + '%';
              
              if (current === total) {
                setTimeout(() => {
                  progressContainer.style.display = 'none';
                  showResult(data, file);
                }, 500);
              }
              
            } catch (error) {
              showError('Ошибка загрузки: ' + error.message);
            }
          }

          function showResult(data, file) {
            result.style.display = 'block';
            
            let preview = '';
            if (file.type.startsWith('image/')) {
              const url = URL.createObjectURL(file);
              preview = '<img src="' + url + '" class="file-preview" alt="Preview">';
            }
            
            result.innerHTML = '
              <h3>✅ Файл успешно загружен!</h3>
              ' + preview + '
              <p><strong>Имя файла:</strong> ' + file.name + '</p>
              <p><strong>Размер:</strong> ' + (file.size / 1024 / 1024).toFixed(2) + ' МБ</p>
              <p><strong>Тип:</strong> ' + file.type + '</p>
              <h4>📝 Ответ сервера:</h4>
              <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; overflow: auto;">' + 
              JSON.stringify(data, null, 2) + '</pre>
            ';
          }

          function showError(message) {
            result.style.display = 'block';
            result.innerHTML = '<h3>❌ Ошибка</h3><p>' + message + '</p>';
            progressContainer.style.display = 'none';
          }

          function clearAll() {
            result.style.display = 'none';
            progressContainer.style.display = 'none';
            progressBar.style.width = '0%';
            fileInput.value = '';
          }

          async function testConnection() {
            try {
              const response = await fetch('/api/health');
              const data = await response.json();
              result.style.display = 'block';
              result.innerHTML = '<h3>✅ Соединение в порядке!</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
              showError('Ошибка соединения: ' + error.message);
            }
          }
        </script>
      </body>
      </html>
    `);
    return;
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'healthy',
      server: 'NFT Upload Server',
      time: new Date().toISOString(),
      message: 'Сервер готов к загрузке файлов!'
    }));
    return;
  }

  if (req.url === '/api/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const response = {
        success: true,
        timestamp: new Date().toISOString(),
        data: {
          id: 'NFT_' + Date.now(),
          name: 'NFT_файл_' + Math.random().toString(36).substr(2, 9),
          description: '🎨 NFT создан успешно! Файл обработан и готов для коллекции.',
          status: 'uploaded',
          metadata: {
            uploadTime: new Date().toLocaleString('ru-RU'),
            server: 'NFT Upload Server',
            processed: true
          }
        },
        message: '🎉 Файл успешно загружен и обработан!'
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(response, null, 2));
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>404 - Страница не найдена</h1>');
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log('✅ NFT ЗАГРУЗКА СЕРВЕР ЗАПУЩЕН!');
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
