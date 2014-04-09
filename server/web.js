var express = require('express');
var logfmt = require('logfmt');
var mongoskin = require('mongoskin');
var grid = require('gridfs-stream');
var _ = require('underscore');
var app = express();

var mongoUri = process.env.MONGOLAB_URI,
	port = Number(process.env.PORT || 5000),
	host = process.env.HOST,
	appFolder = process.env.APP_FOLDER,
	GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET,
	GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

var db = mongoskin.db(mongoUri, { safe: true }),
	gfs = grid(db, mongoskin);

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
	}
));

passport.use(new GitHubStrategy({
		clientID: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET,
		callbackURL: host + '/auth/github/callback'
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));

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
	req.collection = db.collection(collectionName);
	return next();
});

function authCallbackHandler(req, res) {
	// write out the user profile into a cookie for the app
	var user = _.omit(req.user, ['_raw', '_json']);
	res.cookie('sheetuser', JSON.stringify(user));
	// redirect to app's home
	res.redirect(appFolder);
}

// --- Auth Routes ---

app.get('/auth/google', passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
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

app.get(apiBase + '/:collectionName', ensureAuthenticated, function (req, res) {
	var q = JSON.parse(req.query.q.replace(/@\$/g, '$')),
		f = JSON.parse(req.query.f);
	req.collection.find(q, f, { limit: 10, sort: [['_id', -1]] }).toArray(function (err, results) {
		if (err) return next(err);
		res.send(results);
	});
});

app.post(apiBase + '/:collectionName', ensureAuthenticated, function (req, res) {
	console.log('Request Body', req.body);
	// require a user object in the body minimally
	if ( req.body.user ) {
		req.collection.insert(req.body, { safe: true }, function (err, results) {
			console.log('Response', results[0]);
			if (err) return next(err);
			res.status(201).send(results[0]);
		});
	}
});

app.get(apiBase + '/:collectionName/:id', function (req, res) { // this call doesn't require auth to allow for statblock sharing
	req.collection.findById(req.params.id, function (err, result) {
		if (err) return next(err);
		res.send(result);
	});
});

app.put(apiBase + '/:collectionName/:id', ensureAuthenticated, function(req, res) {
	req.collection.updateById(req.params.id, { $set: req.body }, { safe: true, multi: false }, function (err, result) {
		if (err) return next(err);
		// find and return updated resource (because 'update' returns a count of affected resources)
		req.collection.findById(req.params.id, function (err, result) {
			if (err) return next(err);
			res.send(result);
		});
	});
});

app.del('/collections/:collectionName/:id', function(req, res) {
	req.collection.removeById(req.params.id, function (err, result) {
		if (err) return next(err);
		res.send(204); // (No Content)
	});
});

// --- Uploads & Downloads ---

app.post('/upload', function (req, res) {
	var tempfile = req.files.filename.path;
	var origname = req.files.filename.name;
	var writestream = gfs.createWriteStream({ filename: origname });
	// open a stream to the temporary file created by Express...
	fs.createReadStream(tempfile)
		.on('end', function() {
			res.send('OK');
		})
		.on('error', function() {
			res.send('ERR');
		})
		// and pipe it to gfs
		.pipe(writestream);
});

app.get('/download/:filename', function (req, res) {
	// TODO: set proper mime type + filename, handle errors, etc...
	gfs
		// create a read stream from gfs...
		.createReadStream({ filename: req.param('filename') })
		// and pipe it to Express' response
		.pipe(res);
})

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
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.logout();
		res.clearCookie('sheetuser');
		res.send(401);
	}
}
