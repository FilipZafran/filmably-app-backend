const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

router.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, done) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });

  //the login and register routes are working well
  //I am less clear on how this route works but I will try to work on it more tomorrow
  //I think it is worth merging so that some of our authentication is working
  //I will work on this route that allows access to the user object
  router.get("/user", (req, res) => {
    res.send(req.user);
  });
});

module.exports = router;
