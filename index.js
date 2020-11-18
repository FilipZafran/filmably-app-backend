const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user');
const express = require('express');
const dotenv = require('dotenv');
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

//MIDDLEWARE <------ if you think we should put middleware in a seperate foulder that is fine with me

app.use(express.json());
app.use(express.static("Users/edith/Desktop/movie-tinder-app/public"))

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://filmably.netlify.app'], //<----- create-react-app defaults to localhost:3000
    credentials: true,
  })
);

//to my understanding we need to use the session secret to decrypt our hashed passwords
//I put this in the excel spreadsheet as well

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


// const cookieSession = require("express-session");

// const cookieSessionMiddleware = cookieSession({
//   secret: "I am a cookie",
//   originalMaxAge: 1000 * 60 * 60 * 24 * 14
// });

// app.use(cookieSessionMiddleware);



//-------------End of Middleware ---------------------------
//ROUTES

app.use('/authenticate', require('./routes/users'));
// app.use('/Friends', require('./routes/Friends'))
//-----------End of Routes ---------------------------------

//I'n not entirely sure if this is the correct way to disconnect from our database
process.on('SIGNINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected');
    process.exit(0);
  });
});

// app.get("*", function (req, res) {
//   console.log("something in route star")
//   console.log("req.session", req.sessionID)
//   if (req.sessionID) {
//     // console.log(__dirname)
//     console.log(res.redirect("http://localhost:5000/dashboard"))
//     // res.sendFile("/Users/edith/Desktop/movie-tinder-app/public/index.html");
//   } else {
//     res.redirect("/Welcome");
//   }
// });



app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
