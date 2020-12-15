const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//----------SEARCH FRIENDS ROUTE----------
router.get('/findFriend/:username', ensureAuthenticated, (req, res) => {
  const username = `/^${req.params.username}/`;
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

//----------OTHER PROFILE DISPLAY ROUTE----------
router.get('/friendProfile/:otherUserId', ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.params.otherUserId }, async (err, data) => {
    try {
      if (err) throw err;
      if (data) {
        res.send({ msg: 'friend profile', profile: data });
      }
    } catch (err) {
      console.error('there is an error in displaying friendProfile: ', err);
    }
  });
});

module.exports = router;
