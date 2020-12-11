const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//need to add ensureauth
//------------TESTING ROUTE---------//
router.get(
  '/getFriendsStatus/:otherUserId',
  ensureAuthenticated,
  (req, res) => {
    Friends.find(
      {
        $or: [
          { senderUserId: req.user.id, receiverUserId: req.params.otherUserId },
          { senderUserId: req.params.otherUserId, receiverUserId: req.user.id },
        ],
      },
      async (err, rs) => {
        try {
          let results = rs;
          if (err) throw err;
          if (rs.length === 0 || rs === null) {
            res.send({
              data: true,
              addFriend: true,
            });
          } else if (results[0]) {
            if (results[0].accepted === true) {
              res.send({
                data: true,
                unfriend: true,
              });
            } else if (results[0].accepted == false) {
              if (results[0].receiverUserId == req.user.id) {
                res.send({
                  data: true,
                  acceptFriendReq: true,
                });
              } else {
                res.send({
                  data: true,
                  cancelFriendReq: true,
                });
              }
            }
          }
        } catch (err) {
          console.error('there was an error in finding status', err);
        }
      }
    );
  }
);

router.post(
  '/makeFriendRequest/:otherUserId',
  ensureAuthenticated,
  (req, res) => {
    Friends.create(
      {
        senderUserId: req.user.id,
        receiverUserId: req.params.otherUserId,
      },
      async (err, rs) => {
        try {
          if (err) throw err;
          if (rs) {
            res.send({
              data: true,
            });
          }
        } catch (err) {
          console.error('there is an error in makeFriendReq', err);
        }
      }
    );
  }
);

router.post('/unfriend/:otherUserId', ensureAuthenticated, (req, res) => {
  Friends.findOneAndDelete(
    { senderUserId: req.user.id, receiverUserId: req.params.otherUserId },
    (err, rs) => {
      try {
        if (err) throw err;
        if (rs) {
          res.send({ data: true });
        }
      } catch (err) {
        console.error('error in unfriend route', err);
      }
    }
  );
});

//I think you already fixed this endpoint so you can remove what I did
//I just needed to get it working so I could create data
router.post(
  '/acceptFriendRequest/:otherUserId',
  ensureAuthenticated,
  (req, res) => {
    Friends.findOneAndUpdate(
      {
        //I had to switch these two and remove the third parameter because I'm looking
        //for the entry when the request was RECEIVED by the current user
        //and SENT by the user in the params
        senderUserId: req.params.otherUserId,
        receiverUserId: req.user.id,
      },
      //this updates the entry to true
      { $set: { accepted: true } },
      { useFindAndModify: false },
      (err, rs) => {
        try {
          if (err) throw err;
          if (rs) {
            res.send({ accepted: true });
          }
        } catch (err) {
          console.error('there is an error in accept route', err);
        }
      }
    );
  }
);

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

module.exports = router;
