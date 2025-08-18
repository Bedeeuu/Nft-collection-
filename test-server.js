console.log('🔧 ТЕСТОВЫЙ СЕРВЕР ЗАПУСКАЕТСЯ...');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Запрос: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>✅ NFT Сервер Работает!</title>
        <meta charset="utf-8">
        <style>
            body { 
                font-family: Arial; 
                text-align: center; 
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                padding: 50px;
            }
            .success { 
                background: rgba(255,255,255,0.2); 
                padding: 30px; 
                border-radius: 15px; 
                max-width: 500px; 
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="success">
            <h1>🎉 УСПЕХ!</h1>
            <h2>NFT Сервер работает!</h2>
            <p>✅ Node.js установлен</p>
            <p>✅ Сервер запущен на порту 3000</p>
            <p>✅ Готов к загрузке файлов</p>
            <hr>
            <p><strong>Время запуска:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        </div>
    </body>
    </html>
  `);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ ТЕСТОВЫЙ СЕРВЕР ЗАПУЩЕН!`);
  console.log(`🌐 Откройте браузер: http://localhost:${PORT}`);
  console.log(`🔧 Для остановки нажмите Ctrl+C`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Порт ${PORT} уже занят!`);
    console.log(`💡 Попробуйте закрыть другие программы или перезагрузить компьютер`);
  } else {
    console.log(`❌ Ошибка сервера: ${err.message}`);
  }
});
