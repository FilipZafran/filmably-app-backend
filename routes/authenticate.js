const bcrypt = require('bcryptjs');
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ----------AUTHENTICATE ROUTER-----------------------

// POST "/authenticate/login"
// {"username":"Admin", "password":"password"}

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
          .json({ msg: `Sorry something went wrong: ${err}` });
      }
      // check for existing users
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }
      // validate password
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: 'Invalid credentials' });
        jwt.sign(
          { username, id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, msg: 'User successfully logged in' });
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
});

router.post('/register', (req, res) => {
  // check if username and password are ent
  const { username, password } = req.body;
  // email is case insensitive, for further processing I lower the whole email
  const email = req.body.email.toLowerCase();

  //randomly assign a color to the profile using these name keyed to our css naming conventions
  const colorOptions = ['prime', 'error', 'success', 'cold', 'warm'];
  const randomNumber = Math.floor(Math.random() * colorOptions.length);
  const color = colorOptions[randomNumber];


  if (!username || !password || !email) {
    return res.status(400).json({ msg: 'Please fill in all fields!' });
  }
  User.findOne({ username }, async (err, user) => {
    try {
      // check for error
      if (err) {
        return res
          .status(400)
          .json({ msg: `Sorry something went wrong: ${err}` });
      }
      // check for existing users
      if (user) {
        return res
          .status(400)
          .json({ msg: 'Account already exists with this username' });
      }
      // check for existing email
      User.findOne({ email }, async (err, user) => {
        try {
          if (err) {
            return res
              .status(400)
              .json({ msg: `Sorry something went wrong: ${err}` });
          }
          // check for existing email
          if (user) {
            return res
              .status(400)
              .json({ msg: 'Account already exists with this email' });
          }

          // create salt & hash
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            username,
            password: hashedPassword,
            email,
            color,
          });
          await newUser.save();

          // login user after user registered
          User.findOne({ username }, async (err, user) => {
            try {
              // check for error
              if (err) {
                return res
                  .status(400)
                  .json({ msg: `Sorry something went wrong: ${err}` });
              }
              // check for existing users
              if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
              }
              // validate password
              if (user) {
                jwt.sign(
                  { username, id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: 86400 },
                  (err, token) => {
                    if (err) throw err;
                    res.status(201).json({
                      token,
                      msg: 'User successfully created and logged in',
                    });
                  }
                );
              }
            } catch (err) {
              console.log(err);
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
