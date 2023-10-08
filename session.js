const express = require('express');
const session = require('express-session');
const csurf = require('csurf');
const app = express();

// Define your session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

app.use(express.urlencoded({extended: true}));
// Apply the session middleware only to the /protected route
app.use('/protected', sessionMiddleware);

app.use(csurf());

app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('Response Headers:', res.getHeaders());
    next();
});

app.get('/protected', (req, res) => {
	if (!req.session.csrfToken) {
		req.session.csrfToken = req.csrfToken();
	
}
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }
    res.send(`You have viewed this page ${req.session.views} times. CSRF Token: ${req.session.csrfToken}`);
});

app.post('/submitData', csrfProtection, (req, res) => {
    // This is a hypothetical endpoint to handle POST requests and demonstrate CSRF protection
    res.send('Data submitted successfully!');
});


app.get('/unprotected', (req, res) => {
    res.send('This route does not have a session.');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

