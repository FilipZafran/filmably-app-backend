const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');


//----------AUTHENTICATE ROUTER-----------------------

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.send({ message: 'No User Exists' });
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send({
          message: 'Successfully Authenticated',
          user: { username: req.user.username, _id: req.user._id },
        });
        // console.log(req.user);
      });
    }
  })(req, res, next);
});

router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send('User Already Exists');
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save();
        res.send('User Created');
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.get('/user', (req, res) => {
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send('User Logged Out');
});





module.exports = router;
