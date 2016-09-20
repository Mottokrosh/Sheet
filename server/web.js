var express = require('express');
var logfmt = require('logfmt');
var _ = require('underscore');
var app = express();

var mongoUri = process.env.MONGOLAB_PAID,
	port = Number(process.env.PORT || 5000),
	host = process.env.HOST,
	appFolder = process.env.APP_FOLDER,
	GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET,
	GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

var db = require('monk')(mongoUri);

// --- Passport ---

var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: host + '/auth/google/callback'
},
function (accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return done(null, profile);
	});
}));

passport.use(new GitHubStrategy({
	clientID: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	callbackURL: host + '/auth/github/callback'
},
function (accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		return done(null, profile);
	});
}));

// --- Configuration ---

app.use(logfmt.requestLogger());
app.use(express.cookieParser());
app.use(express.json()); // this, urlencoded, and multipart supercede bodyParser
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(express.session({ secret: 'Sho0bd0obe3do0w4h' }));
app.use(passport.initialize());
app.use(passport.session());

app.param('collectionName', function (req, res, next, collectionName) {
	req.collection = db.get(collectionName);
	return next();
});

function authCallbackHandler(req, res) {
	// write out the user profile into a cookie for the app
	var user = _.omit(req.user, ['_raw', '_json']);
	res.cookie('sheetuser', JSON.stringify(user));
	// redirect to app's home
	//res.redirect(appFolder); MYSTERIOUS BUG
	res.redirect('/redirect.html'); // hacky workaround
}

// --- Helper Functions ---

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.logout();
		res.clearCookie('sheetuser');
		res.send(401);
	}
}

// --- Auth Routes ---

app.get('/auth/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/plus.login'
	]
}));

app.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: appFolder + '/#/login' }),
	authCallbackHandler
);

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
	passport.authenticate('github', { failureRedirect: appFolder + '/#/login' }),
	authCallbackHandler
);

// --- API Routes ---

var apiBase = '/api/v1';

app.get(apiBase, ensureAuthenticated, function (req, res) {
	res.send('This is the API service.');
});

app.get(apiBase + '/:collectionName', ensureAuthenticated, function (req, res, next) {
	var q = JSON.parse(req.query.q.replace(/@\$/g, '$')),
		f = JSON.parse(req.query.f);
	req.collection.find(q, f).then(function (results) {
		// , { limit: 50, sort: [['_id', -1]] }
		res.send(results);
	}).catch(function (err) {
		return next(err);
	});
});

app.post(apiBase + '/:collectionName', ensureAuthenticated, function (req, res, next) {
	// require a user object in the body minimally
	if (req.body.user && req.body.user.id) {
		req.collection.insert(req.body).then(function (doc) {
			res.status(201).send(doc);
		}).catch(function (err) {
			return next(err);
		});
	} else {
		res.send(401);
	}
});

app.get(apiBase + '/:collectionName/:id', function (req, res, next) { // this call doesn't require auth to allow for statblock sharing
	req.collection.findOne({ _id: req.params.id }).then(function (doc) {
		res.send(doc);
	}).catch(function (err) {
		return next(err);
	});
});

app.put(apiBase + '/:collectionName/:id', ensureAuthenticated, function (req, res, next) {
	if (req.body.user && req.body.user.id) {
		req.collection.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then(function (updatedDoc) {
			res.send(updatedDoc);
		}).catch(function (err) {
			return next(err);
		});
	} else {
		res.send(401);
	}
});

app.del('/collections/:collectionName/:id', function(req, res, next) {
	req.collection.findOneAndDelete({ _id: req.params.id }).then(function () {
		res.send(204); // (No Content)
	}).catch(function (err) {
		return next(err);
	});
});

// --- App Routes ---

app.get('/logout', function (req, res){
	req.logout();
	res.clearCookie('sheetuser');
	res.redirect(appFolder);
});

app.use('/pathfinder_dev', express.static('app/'));
app.use('/pathfinder', express.static('dist/'));
app.use('/', express.static('public/'));

// --- Server Listening ---

app.listen(port, function () {
	console.log('Listening on ' + port);
});
