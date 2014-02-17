var express = require('express');
var logfmt = require('logfmt');
var mongo = require('mongodb');
var app = express();

var mongoUri = process.env.MONGOLAB_URI,
	port = Number(process.env.PORT || 5000),
	appUrl = process.env.APP_URL,
	GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: appUrl + '/auth/google/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			// To keep the example simple, the user's Google profile is returned to
			// represent the logged-in user. In a typical application, you would want
			// to associate the Google account with a user record in your database,
			// and return that user instead.
			return done(null, profile);
		});
	}
));

app.use(logfmt.requestLogger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'Sho0bd0obe3do0w4h' }));
app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}));

app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/#/login' }),
	function (req, res) {
		// write out the user profile into a cookie for the app
		res.cookie('sheetuser', JSON.stringify(req.user));
		// redirect to app's home
		res.redirect('/');
	}
);

app.get('/api', ensureAuthenticated, function (req, res) {
	res.send('This will be the API service.');
});

app.get('/logout', function(req, res){
	req.logout();
	res.clearCookie('sheetuser');
	res.redirect('/');
});

app.use('/app', express.static('app/'));
app.use('/', express.static('dist/'));

app.listen(port, function () {
	console.log("Listening on " + port);
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/#/login');
}
