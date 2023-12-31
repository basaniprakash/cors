const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();

// SSL config
const privateKey = fs.readFileSync('certs/mainapp.key', 'utf8');
const certificate = fs.readFileSync('certs/mainapp.crt', 'utf8');
const ca = fs.readFileSync('certs/ca.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

// Allow the null as the auth redirect causes browser stip the Origin, ie. set to null
const allowedOrigins = ['https://www.corsui.com', 'https://www.corsauth.com', 'https://www.corsmainapp.com', 'null', 'undefined'];

const corsOptions = {
    origin: function (origin, callback) {
		if ( orgin === 'null' ) {
			console.log('origin is null');
		}
		if ( origin === 'undefined') {
			console.log('origin is undefined');
		}

		if ( orgin === null ) {
			console.log('origin is null');
		}
		if ( origin === undefined) {
			console.log('origin is undefined');
		}
        if (allowedOrigins.indexOf(origin) !== -1) {
			console.log('allowed origin');
            callback(null, true);
        } else {
			console.log('incorrect origin, but allowing', origin);
            callback(null, true);
            callback(new Error('Not allowed by CORS'));
        }
    },
	//origin: null,
    credentials: true,
	methods: "GET,POST,PUT,DELETE,OPTIONS",
	allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
}

app.use(cors(corsOptions));

// Just a debug stuff
app.use((err, req, res, next) => {
    console.error('Error message:', err.message);
    console.error('Origin:', req.headers.origin);
    console.error('Request URL:', req.url);
    console.error('Method:', req.method);
//    res.status(400).send('Error: ' + err.message);
	next();
});


//app.use((req, res, next) => {
 //   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  //  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
   // next();
//});


app.use(function (req, res, next) {
//res.setHeader('Access-Control-Allow-Origin', null);
//res.setHeader('Access-Control-Allow-Credentials', true);
next();
});
app.get('/complete-auth', (req, res) => {
    // Here, process the token and CSRF data.
    // Once validated, let the user in, or reject if there's an issue.
    const token = req.query.token;
    const csrf = req.query.csrf;

    // ... Token validation logic ...
	console.log(`req: ${req} \nres: ${res}`);
	//res.send('<h2>Authentication successful! Welcome to MainApp.</h2>'); 	
	console.log('completed the auth');
 	res.redirect('https://www.corsmainapp.com/home');
});

app.get('/favicon.ico', (req, res) => res.send('favicon.ico'));

app.get('/home', (req, res) => {
    // Send the mainapp's homepage content or render a template
    res.send('<h1>Welcome to MainApp Homepage</h1>');
});

const host = 'www.corsmainapp.com';
const port = 443;
https.createServer(credentials, app).listen(port, host, () => {
    console.log(`MainApp server running on ${host}:${port}`);
});

