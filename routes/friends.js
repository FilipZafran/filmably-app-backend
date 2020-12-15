const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js');
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const user = require('../models/user');

//------------TESTING ROUTE---------//

//get friend invitations
router.get('/invitations', ensureAuthenticated, (req, res) => {
  Friends.find(
    {
      receiverUserId: req.user.id,
      accepted: false,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data)
          res.send({ msg: 'no pending invitations', pendingInvitations: [] });
        if (data) {
          const pendingInvitations = data.map((x) => x.senderUserId);
          res.send({
            msg: 'pending invitations',
            pendingInvitations: pendingInvitations,
          });
        }
      } catch (err) {
        console.error('there was an error in finding friendsInvitations', err);
      }
    }
  );
});
//get friend requests
router.get('/requests', ensureAuthenticated, (req, res) => {
  Friends.find(
    {
      senderUserId: req.user.id,
      accepted: false,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data)
          res.send({ msg: 'no pending requests', pendingRequests: [] });
        if (data) {
          const pendingRequests = data.map((x) => x.receiverUserId);
          res.send({
            msg: 'pending requests',
            pendingRequests: pendingRequests,
          });
        }
      } catch (err) {
        console.error('there was an error in finding friendsRequests', err);
      }
    }
  );
});

//returns an object of the userIds of all the logged in user's friends {friends: [<userId>,<userId>]}
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
        if (!doc) res.send([]);
        if (doc) {
          const friendsArray = doc.map((x) => {
            if (x.senderUserId === req.user.id) {
              return x.receiverUserId;
            } else return x.senderUserId;
          });
          res.send({ friends: friendsArray });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
});

//send friend request
router.post('/sendRequest/:otherUserId', ensureAuthenticated, (req, res) => {
  Friends.findOne(
    {
      $or: [
        { senderUserId: req.params.otherUserId, receiverUserId: req.user.id },
        { senderUserId: req.params.otherUserId, receiverUserId: req.user.id },
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
            receiverUserId: req.params.otherUserId,
            accepted: false,
          });
          await newRequest.save();
          return res.send({ msg: 'request sent' });
        }
      } catch (err) {
        console.error('there is an error in makeFriendReq: ', err);
      }
    }
  );
});

//accept friend request
router.patch('/acceptRequest/:otherUserId', ensureAuthenticated, (req, res) => {
  Friends.findOneAndUpdate(
    {
      senderUserId: req.params.otherUserId,
      receiverUserId: req.user.id,
    },
    { $set: { accepted: true } },
    { useFindAndModify: false },
    (err, doc) => {
      try {
        if (err) throw err;
        if (doc) {
          res.send({ senderUserId: req.params.otherUserId, accepted: true });
        }
      } catch (err) {
        console.error('there is an error in accept route: ', err);
      }
    }
  );
});

//remove friend request or deny friend request or unfriend
router.delete('/removeFriend/:otherUserId', ensureAuthenticated, (req, res) => {
  Friends.findOneAndDelete(
    {
      $or: [
        { senderUserId: req.params.otherUserId, receiverUserId: req.user.id },
        { senderUserId: req.params.otherUserId, receiverUserId: req.user.id },
      ],
    },
    (err, data) => {
      try {
        if (err) throw err;
        if (data) {
          res.send({ msg: 'friendship removed' });
        }
      } catch (err) {
        console.error('error in unfriend route', err);
      }
    }
  );
});

module.exports = router;
