var express = require('express');
var logfmt = require('logfmt');
var mongo = require('mongodb');
var app = express();

var mongoUri = process.env.MONGOLAB_URI,
	port = Number(process.env.PORT || 5000),
	host = process.env.HOST,
	appFolder = process.env.APP_FOLDER,
	GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// --- Passport ---

var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

// --- Configuration ---

passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: host + '/auth/google/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
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
app.use(passport.session());

// --- Auth Routes ---

app.get('/auth/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]
}));

app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: appFolder + '/#/login' }),
	function (req, res) {
		// write out the user profile into a cookie for the app
		res.cookie('sheetuser', JSON.stringify(req.user));
		// redirect to app's home
		res.redirect(appFolder);
	}
);

// --- API Routes ---

app.get('/api', ensureAuthenticated, function (req, res) {
	res.send('This will be the API service.');
});

// --- App Routes ---

app.get('/logout', function(req, res){
	req.logout();
	res.clearCookie('sheetuser');
	res.redirect(appFolder);
});

app.use('/pathfinder_dev', express.static('app/'));
app.use('/pathfinder', express.static('dist/'));
app.use('/', express.static('public/'));

// --- Server Listening ---

app.listen(port, function () {
	console.log("Listening on " + port);
});

// --- Helper Functions ---

function ensureAuthenticated(req, res, next) {
	/*console.log('===========');
	console.log(req.session);
	console.log(req._passport);
	console.log(req.user);
	console.log(req.isAuthenticated());
	console.log('===========');*/
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect(appFolder + '/#/login');
	}
}
