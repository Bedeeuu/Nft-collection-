const { exec } = require('child_process');

// Start the server
exec('node ../server/instant-server.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error starting server: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Server stderr: ${stderr}`);
        return;
    }
    console.log(`Server output: ${stdout}`);
});

// Open the client application in the default browser
exec('start http://localhost:3000', (error) => {
    if (error) {
        console.error(`Error opening browser: ${error.message}`);
    }
});