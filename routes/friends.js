const express = require('express');

const router = express.Router();
const Friends = require('../models/friends.js');
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// ------------TESTING ROUTE---------//

// get friend invitations
router.get('/invitations', ensureAuthenticated, (req, res) => {
  Friends.find(
    {
      receiverUserId: req.user.id,
      accepted: false,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        const userIds = data.map((x) => x.senderUserId);

        User.find({ _id: { $in: userIds } }, async (err, doc) => {
          try {
            if (err) throw err;
            const pendingInvitations = doc.map((user) => ({
              id: user._id,
              username: user.username,
              color: user.color ? user.color : 'warm',
            }));
            res.send({
              msg: 'pending invitations',
              pendingInvitations,
            });
          } catch (err) {
            console.error(
              'there was an error in finding invitations profiles',
              err
            );
          }
        });
      } catch (err) {
        console.error('there was an error in finding friendsInvitations', err);
      }
    }
  );
});
// get friend requests
router.get('/requests', ensureAuthenticated, (req, res) => {
  Friends.find(
    {
      senderUserId: req.user.id,
      accepted: false,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        const userIds = data.map((x) => x.receiverUserId);

        User.find({ _id: { $in: userIds } }, async (err, doc) => {
          try {
            if (err) throw err;
            const pendingRequests = doc.map((user) => ({
              id: user._id,
              username: user.username,
              color: user.color ? user.color : 'warm',
            }));
            res.send({
              msg: 'pending requests',
              pendingRequests,
            });
          } catch (err) {
            console.error(
              'there was an error in finding request profiles',
              err
            );
          }
        });
      } catch (err) {
        console.error('there was an error in finding friendsRequests', err);
      }
    }
  );
});

// returns an object of the userIds of all the logged in user's friends {friends: [<userId>,<userId>]}
router.get('/allFriends', ensureAuthenticated, (req, res) => {
  Friends.find(
    {
      $and: [
        { accepted: true },
        {
          $or: [{ senderUserId: req.user.id }, { receiverUserId: req.user.id }],
        },
      ],
    },
    async (err, doc) => {
      try {
        if (err) throw err;
        const userIds = doc.map((x) => {
          if (x.senderUserId.toString() === req.user.id) {
            return x.receiverUserId;
          }
          return x.senderUserId;
        });
        User.find({ _id: { $in: userIds } }, async (err, doc) => {
          try {
            if (err) throw err;
            const friendsArray = doc.map((user) => ({
              id: user._id,
              username: user.username,
              color: user.color ? user.color : 'warm',
            }));
            res.send({
              msg: 'friends list',
              friends: friendsArray,
            });
          } catch (err) {
            console.error('there was an error in finding friends', err);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  );
});

// send friend request
router.post('/sendRequest', ensureAuthenticated, (req, res) => {
  Friends.findOne(
    {
      $or: [
        { senderUserId: req.body.id, receiverUserId: req.user.id },
        { senderUserId: req.body.id, receiverUserId: req.user.id },
      ],
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (data) {
          res.send({ msg: 'request already exists' });
        }
        if (!data) {
          const newRequest = new Friends({
            senderUserId: req.user.id,
            receiverUserId: req.body.id,
            accepted: false,
          });
          await newRequest.save();
          return res.send({ msg: 'request sent' });
        }
      } catch (err) {
        console.error('there is an error in sendFriendReq: ', err);
      }
    }
  );
});

// accept friend request
router.patch('/acceptRequest/:otherUserId', ensureAuthenticated, (req, res) => {
  Friends.findOneAndUpdate(
    {
      senderUserId: req.params.otherUserId,
      receiverUserId: req.user.id,
    },
    { $set: { accepted: true, requestConfirmed: new Date() } },
    { useFindAndModify: false },
    (err, doc) => {
      try {
        if (err) throw err;
        if (doc) {
          res.send({ senderUserId: req.params.otherUserId, accepted: true });
        }
      } catch (err) {
        console.error('there is an error in acceptFreinedReq: ', err);
      }
    }
  );
});

// remove friend request or deny friend request or unfriend
router.delete('/removeFriend/:otherUserId', ensureAuthenticated, (req, res) => {
  Friends.findOneAndDelete(
    {
      $or: [
        { senderUserId: req.params.otherUserId, receiverUserId: req.user.id },
        { senderUserId: req.user.id, receiverUserId: req.params.otherUserId },
      ],
    },
    (err, data) => {
      try {
        if (err) {
          throw err;
        } else {
          res.send({ msg: 'friendship removed', removed: data });
        }
      } catch (err) {
        console.error('error in unfriend route', err);
      }
    }
  );
});

module.exports = router;
