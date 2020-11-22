const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


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


//----------LOADING FRIEND ROUTE----------

router.get('/users.json', (req, res) => {

  User.find({}, function (err, users) {
    try {
      if (err) throw err;

      if (users) {
        let loadsThreeLast = users.splice(users.length - 3, users.length - 1)
        res.send(loadsThreeLast)
      }
    } catch (err) {
      console.error("there was an error in users.json", error)
    }
  })

})


//----------SEARCH FRIENDS ROUTE----------
router.get("/FindPeople/:searchPeople", (req, res) => {
  console.log("made it to route findpeople")
  let search = req.params.searchPeople;
  console.log("search", search)
  // User.index({ username: 'text' });
  User.find({ $text: { $search: search } }, async (err, rs) => {
    try {
      if (err) throw err;
      if (rs) {
        res.send(rs)
      }
    } catch (err) {
      console.error("there is an error in search", err)
    }
  })
})

//----------OTHER PROFILE DISPLAY ROUTE----------
router.get("/OtherProfile/:id.json", (req, res) => {
  User.findOne({ _id: req.params.id }, async (err, rs) => {
    // console.log("rs in other profile", rs)
    try {
      if (err) throw err
      if (rs) {
        res.send(rs)
      }
    } catch (err) {
      console.error("there is an error in displaying otherProfile", err)
    }
  })
})


module.exports = router;
