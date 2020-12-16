const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//----------SEARCH FRIENDS ROUTE----------
router.get('/findFriend', ensureAuthenticated, (req, res) => {
  const username = `/^${req.body.username}/`;
  User.find(
    { $search: { text: { query: username, path: 'username' } } },
    async (err, data) => {
      try {
        if (err) throw err;
        if (data) {
          res.send({ msg: 'users found', users: data });
        }
      } catch (err) {
        console.error('there is an error in search', err);
      }
    }
  );
});

//----------GET PROFILE INFORMANTION----------

router.get('/user', ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.body.userId }, async (err, data) => {
    try {
      if (err) throw err;
      if (data) {
        res.send({ msg: 'profile found', profile: data });
      }
    } catch (err) {
      console.log('there was a problem finding the profile: ', err);
    }
  });
});

//---------------DELETE USER PROFILE ---------------

router.get('/deleteProfile', ensureAuthenticated, (req, res) => {
  User.deleteOne({ _id: req.user.id }, async (err, data) => {
    try {
      if (err) throw err;
      if (data) {
        res.send({ msg: 'profile deleted', profile: data });
      }
    } catch (err) {
      console.log('there was a problem deleting the profile: ', err);
    }
  });
});

module.exports = router;
