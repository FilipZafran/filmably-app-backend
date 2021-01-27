const express = require('express');

const router = express.Router();
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// ----------SEARCH FRIENDS ROUTE----------
router.post('/findFriend', ensureAuthenticated, (req, res) => {
  const username = new RegExp(`^${req.body.username}`);
  User.find(
    { username: { $regex: username, $options: 'i' } },
    async (err, data) => {
      try {
        if (err) throw err;
        const users = data
          .filter((x) => x._id.toString() !== req.user.id)
          .map((x) => ({ id: x._id, username: x.username }));

        res.send({
          msg: 'users found',
          users,
        });
      } catch (err) {
        console.error('there is an error in search', err);
      }
    }
  );
});

// ----------GET PROFILE INFORMANTION----------

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

// -----------UPDATE PROFILE INFORMATION-------------

router.patch('/updateUserInfo', ensureAuthenticated, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      username: req.body.username,
      age: req.body.age,
      city: req.body.city,
      email: req.body.email,
    },
    { useFindAndModify: false },
    async (err, data) => {
      try {
        if (err) throw err;
        if (data) {
          res.send({ msg: 'profile updated' });
        }
        if (!data) {
          res.send({ msg: 'no profile found' });
        }
      } catch (err) {
        console.log('there was a problem updating the profile: ', err);
      }
    }
  );
});

// ---------------DELETE USER PROFILE ---------------

// needs to also delete friend requests and likeTrackers
router.delete('/deleteProfile', ensureAuthenticated, (req, res) => {
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
