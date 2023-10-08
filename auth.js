const express = require('express');
const cors = require('cors');
const csurf = require('csurf');
const app = express();
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(new GoogleStrategy({
	clientID: ''
	clientSecret: ''
	callbackURL: 'https://www.corsauth.com/auth/callback'
	}, (token, tokenSecret, profile, done) => {
	return done(null, profile);
}));

app.get('/auth/google', passport.authenticate('google', {
	scope: ['https://www.googleapis.com/auth/plus.login']
}));

app.get('/auth/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return next(err);
        }
        if (!user) {
            console.log("Authentication failed:", info.message);
            return res.redirect('/'); // Failed auth, so maybe stay on the auth page or go to an error page.
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            return res.redirect('https://www.corsmainapp.com/complete-auth');  // Redirect to the main app on successful authentication.
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.get('/start-auth', (req, res) => {
    console.log('/start-auth');
	const token = 'some_generated_token';
	const csrfToken = req.csrfToken();

    // This is a simulated logic to start the authentication process.
    let redirectUrl = `https://www.corsmainapp.com/complete-auth?token=someToken&csrf=${req.csrfToken()}`;
    res.json({
			redirectURL: `https://www.corsmainapp.com/complete-auth?token=${token}&_csrf=${csrfToken}`,
			csrfToken: csrfToken
	});
    //res.redirect(redirectUrl);
});

app.get('/favicon.ico', (req, res) => {
    res.send('favicon');
});

app.get('/', (req, res) => {
    res.send('Welcome to Cors Auth!');
});


// Starting the server with HTTPS
const host = 'www.corsauth.com';
const port = 443;
https.createServer(credentials, app).listen(port, host, () => {
    console.log(`Auth server running on ${host}:${port}`);
});

