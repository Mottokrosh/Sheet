var express = require('express');
var session = require('express-session');
var MemoryStore = require('memorystore')(session);
var logfmt = require('logfmt');
var _ = require('underscore');
var { OAuth2Client } = require('google-auth-library');
var app = express();

var mongoUri = process.env.MONGOLAB_PAID,
	port = Number(process.env.PORT || 5000),
	host = process.env.HOST,
	appFolder = process.env.APP_FOLDER,
	GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET,
	NEW_GOOGLE_CLIENT_ID = process.env.NEW_GOOGLE_CLIENT_ID;

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var dbName = 'heroku_app22202560_copy';
var collectionName = 'characters';

var oAuth2Client = new OAuth2Client(NEW_GOOGLE_CLIENT_ID);

async function verifyGoogleUser(req) {
	var user = JSON.parse(req.cookies.sheetuser);
	if (!user) return false;

	const ticket = await oAuth2Client.verifyIdToken({
		idToken: user.token,
		audience: NEW_GOOGLE_CLIENT_ID
	});
	// const payload = ticket.getPayload();
	return ticket;
}

// --- Passport ---

var passport = require('passport'),
	GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

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
app.use(session({
	name: 'node_session',
	cookie: { maxAge: 86400000 },
	store: new MemoryStore({
		checkPeriod: 3600000 // prune expired entries every 1h
	}),
	secret: 'Sho0bd0obe3do0w4h',
	saveUninitialized: false,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

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
	verifyGoogleUser(req)
		.then(function (ticket) {
			console.log('SUCCESSFUL GOOGLE TOKEN VERIFICATION', ticket);
			return next();
		})
		.catch(function (err) {
			if (err) {
				console.log('UNSUCCESSFUL GOOGLE TOKEN VERIFICATION', err);
			}
			if (req.isAuthenticated()) {
				console.log('SUCCESSFUL LEGACY VERIFICATION', req.cookies.sheetuser);
				return next();
			} else {
				console.log('UNAUTHORIZED', req.cookies.sheetuser);
				req.logout();
				res.clearCookie('sheetuser');
				res.send(401);
			}
		})
	;
}

async function query(cb) {
	const client = new MongoClient(mongoUri, { useNewUrlParser: true });

	try {
		await client.connect();
		const db = client.db(dbName);
		const col = db.collection(collectionName);
		cb(col);
		
	} catch (err) {
		console.log(err.stack);
		return next(err);
	}

	client.close();
}

// --- Auth Routes ---

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

// Read All
app.get(apiBase + '/characters', ensureAuthenticated, function (req, res, next) {
	const q = JSON.parse(req.query.q.replace(/@\$/g, '$'));
	const f = JSON.parse(req.query.f);

	query(async (col) => {
		const docs = await col.find(
			q,
			{
				projection: f,
				sort: [['_id', -1]]
			}
		).toArray();
		res.send(docs);
	});
});

// Create
app.post(apiBase + '/characters', ensureAuthenticated, function (req, res, next) {
	// require a user object in the body minimally
	if (req.body.user && req.body.user.id) {
		query(async (col) => {
			const r = await col.insertOne(req.body);
			res.status(201).send(r.ops[0]);
		});
	} else {
		res.send(401);
	}
});

// Read
app.get(apiBase + '/characters/:id', function (req, res, next) { // this call doesn't require auth to allow for statblock sharing
	query(async (col) => {
		try {
			const doc = await col.findOne({ _id: new ObjectId(req.params.id) });
			if (doc) {
				res.send(doc);
			} else {
				res.send(404);
			}

		} catch (err) {
			return next(err);
		}
	});
});

// Update
app.put(apiBase + '/characters/:id', ensureAuthenticated, function (req, res, next) {
	if (req.body.user && req.body.user.id) {
		query(async (col) => {
			try {
				const r = await col.findOneAndUpdate(
					{ _id: new ObjectId(req.params.id) },
					{ $set: req.body },
					{ returnOriginal: false },
				);
				if (r.value) {
					res.send(r.value);
				} else {
					res.send(404);
				}

			} catch (err) {
				return next(err);
			}
		});
	} else {
		res.send(401);
	}
});

// Delete
app.delete('/collections/characters/:id', function(req, res, next) {
	query(async (col) => {
		await col.findOneAndDelete({ _id: new ObjectId(req.params.id) });
		res.send(204); // (No Content)
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
