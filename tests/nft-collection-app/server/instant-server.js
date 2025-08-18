const http = require('http');
const nftMaster = require('./nft-master');

const PORT = 3000;

const server = http.createServer((req, res) => {
    nftMaster(req, res);
});

server.listen(PORT, () => {
    console.log(`🚀 Instant server is running on http://localhost:${PORT}`);
});