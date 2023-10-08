const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
//const fetch = require('node-fetch'); // You might need to npm install node-fetch

const app = express();

// SSL configuration
const privateKey = fs.readFileSync('certs/ui.key', 'utf8');
const certificate = fs.readFileSync('certs/ui.crt', 'utf8');
const ca = fs.readFileSync('certs/ca.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use(express.static(path.join(__dirname, ".")));

app.get('/favicon.ico', (req, res) => res.send('favicon'));

// UI server 
const host = 'www.corsui.com';
const port = 443;
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, host, () => {
    console.log(`UI server running on ${host}:${port}`);
});

