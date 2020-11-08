const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user');

const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

//-------------------End of Imports----------------------------

//the MONGO_USER and MONGO_PW are listed in our excel spreadsheet

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@filmably.awjtp.mongodb.net/filmably?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`${process.env.MONGO_USER} Connected To Mongoose`);
  }
);

//MIDDLEWARE <------ if you think we should put middleware in a seperate foulder that is fine with me

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:3000', //<----- create-react-app defaults to localhost:3000
    credentials: true,
  })
);

//to my understanding we need to use the session secret to decrypt our hashed passwords
//I put this in the excel spreadsheet as well

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//-------------End of Middleware ---------------------------
//ROUTES

app.use('/authenticate', require('./routes/users'));

//-----------End of Routes ---------------------------------

//I'n not entirely sure if this is the correct way to disconnect from our database
process.on('SIGNINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected');
    process.exit(0);
  });
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
