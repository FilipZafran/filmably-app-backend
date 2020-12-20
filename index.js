const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
// const nodemailer = require('nodemailer');
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
    origin: ['http://localhost:3000', 'https://filmably.netlify.app'],
    credentials: true,
  })
);

//MIDDLEWARE

app.use(express.json());

// File Upload
app.use(fileUpload());

//THIS SESSION SECRET WILL BE CHANGED FOR PRODUCTION
const SESSION_SECRET = process.env.SESSIONSECRET;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
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
app.use('/movies', require('./routes/movies'));
app.use('/toSwipe', require('./routes/toSwipe'));
app.use('/uploads', require('./routes/uploads'));
app.use('/resetPassword', require('./routes/resetPassword'));

//-----------End of Routes ---------------------------------

//I'n not entirely sure if this is the correct way to disconnect from our database
process.on('SIGNINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected');
    process.exit(0);
  });
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
