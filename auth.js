const express = require('express');
const cors = require('cors');
const csurf = require('csurf');
const app = express();
const session = require('express-session');
const https = require('https');
const fs = require('fs');

// SSL config
const privateKey = fs.readFileSync('certs/auth.key', 'utf8');
const certificate = fs.readFileSync('certs/auth.crt', 'utf8');
const ca = fs.readFileSync('certs/ca.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use(session({
    secret:'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(cors({
    origin: 'https://www.corsui.com',
    optionsSuccessStatus: 200,
    credentials: true
}));

app.use(csurf());

app.get('/start-auth', (req, res) => {
    console.log('/start-auth');
    // This is a simulated logic to start the authentication process.
    let redirectUrl = `https://www.corsmainapp.com/complete-auth?token=someToken&csrf=${req.csrfToken()}`;
    res.redirect(redirectUrl);
});

// Starting the server with HTTPS
const host = 'www.corsauth.com';
const port = 443;
https.createServer(credentials, app).listen(port, host, () => {
    console.log(`Auth server running on ${host}:${port}`);
});

