const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user');
const LikeTracker = require('./models/likeTracker');
const Friends = require('./models/friends');
const express = require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

//-------------------End of Imports----------------------------

//the MONGO_USER and MONGO_PW NEED TO BE CHANGED FOR PRODUCTION
const MONGO_USER = process.env.MONGOUSER;
const MONGO_PW = process.env.MONGOPW;

mongoose.connect(
	`mongodb+srv://${MONGO_USER}:${MONGO_PW}@filmably.awjtp.mongodb.net/filmably?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, client) => {
		if (err) {
			console.log('Databse err: ' + err);
		} else {
			console.log(`${MONGO_USER} Connected To Mongoose`);
		}
	}
);

// create-react-app defaults to localhost:3000
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: [ 'http://localhost:3000', 'https://filmably.netlify.app' ], //<----- create-react-app defaults to localhost:3000
		credentials: true
	})
);

//MIDDLEWARE <------ if you think we should put middleware in a seperate foulder that is fine with me

app.use(express.json());

// File Upload
app.use(fileUpload());

// upload endpoint
app.post('/uploads', (req, res) => {
	if (req.files === null) {
		return res.status(400).json({ msg: 'No file was uploaded' });
	}

	const file = req.files.file;
	file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}

		res.json({ filenName: file.name, filePath: `/uploads/${file.name}` });
	});
});

//to my understanding we need to use the session secret to decrypt our hashed passwords
//I put this in the excel spreadsheet as well

//THIS SESSION SECRET WILL BE CHANGED FOR PRODUCTION
const SESSION_SECRET = process.env.SESSIONSECRET;

app.use(
	session({
		secret: SESSION_SECRET,
		resave: true,
		saveUninitialized: true
	})
);

app.use(cookieParser(SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//-------------End of Middleware ---------------------------
//ROUTES

app.use('/authenticate', require('./routes/authenticate'));
app.use('/profiles', require('./routes/profiles'));
app.use('/likeTracker', require('./routes/likeTracker'));
app.use('/friends', require('./routes/friends'));

//-----------End of Routes ---------------------------------

//I'n not entirely sure if this is the correct way to disconnect from our database
process.on('SIGNINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose disconnected');
		process.exit(0);
	});
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
