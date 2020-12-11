const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const jwt = require('jsonwebtoken');

//----------AUTHENTICATE ROUTER-----------------------

//POST "/authenticate/login"
//{"username":"Admin", "password":"password"}

router.post('/login', (req, res) => {
  // check if username and password are entered
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please enter a username and a password' });
  }
  User.findOne({ username }, async (err, user) => {
    try {
      // check for error
      if (err) {
        return res
          .status(400)
          .json({ msg: 'Sorry something went wrong: ' + err });
      }
      // check for existing users
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }
      // validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
      jwt.sign(
        { username: username },
        process.env.JWT_SECRET,
        { expiresIn: 86400 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token, msg: 'User succesfully logged in' });
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
});

router.post('/register', (req, res) => {
  // check if username and password are entered
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please enter a username and a password' });
  }
  User.findOne({ username }, async (err, user) => {
    try {
      // check for error
      if (err) {
        return res
          .status(400)
          .json({ msg: 'Sorry something went wrong: ' + err });
      }
      // check for existing users
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      // create salt & hash
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      return res.status(201).json({ msg: 'User successfully created' });
    } catch (err) {
      console.log(err);
    }
  });
});

router.get('/user', (req, res) => {
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  res.send(req.user.username + ' Logged Out');
  req.logout();
});

module.exports = router;
