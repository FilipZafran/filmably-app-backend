const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");

const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();

//-------------------end of imports----------------------------

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@filmably.awjtp.mongodb.net/filmably?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(`${process.env.MONGO_USER} Connected To Mongoose`);
  }
);

//MIDDLEWARE <------ if you think we should put middleware in a seperate foulder that is fine with me

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", //<----- create-react-app defaults to localhost:3000
    credentials: true,
  })
);

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
require("./passportConfig")(passport);

//-------------End of Middleware ---------------------------

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
