const express = require('express');
const https = require('https');
const fs = require('fs');
//const fetch = require('node-fetch'); // You might need to npm install node-fetch

const app = express();

// SSL configuration
const privateKey = fs.readFileSync('/home/bs/certs/ui.key', 'utf8');
const certificate = fs.readFileSync('/home/bs/certs/ui.crt', 'utf8');
const ca = fs.readFileSync('/home/bs/certs/ca.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.get('/', (req, res) => {
    const html = `
    <html>
    <head>
        <title>CORS UI</title>
    </head>
    <body>
        <button onclick="startAuth()">Start Authentication</button>
        <script>
async function startAuth() {
    try {
        const response = await fetch('https://www.corsauth.com/start-auth', 			{
           	 method: 'GET',
           	 mode: 'cors',
           	 credentials: 'include' // Include cookies for the request
        	});

        // Check if the response is okay
 		if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            // Handle JSON response
            const data = await response.json();
            console.log(data);
			// Check for the presence of the redirectUrl in the response
			if (data.redirectUrl) {
    			window.location.href = data.redirectUrl; // Redirect to the MainApp homepage
			} else {
    			console.error("Redirect URL missing from server response");
			}
        } else {
            // Handle plain text or HTML response
            const text = await response.text();
            console.log(text);
        }
        
    } catch (error) {
        console.error("Error during authentication:", error);
    }
}
       </script>
    </body>
    </html>
    `;

    res.send(html);
});

app.get('/favicon.ico', (req, res) => res.send('favicon'));

// UI server 
const host = 'www.corsui.com';
const port = 443;
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, host, () => {
    console.log(`UI server running on ${host}:${port}`);
});

