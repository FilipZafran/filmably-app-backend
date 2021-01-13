const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js');
const User = require('../models/user');
const LikeTracker = require('../models/likeTracker');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//GET the friends who also like a specific movie

router.get('/oneFilm/:filmId', ensureAuthenticated, (req, res) => {
  //get a list of all friends
  Friends.find(
    {
      $and: [
        { accepted: true },
        {
          $or: [{ senderUSerId: req.user.id }, { receiverUserId: req.user.id }],
        },
      ],
    },
    async (err, doc) => {
      try {
        if (err) throw err;
        const friendsList = doc.map((x) => {
          if (x.senderUserId.toString() === req.user.id) {
            return x.receiverUserId;
          } else return x.senderUserId;
        });
        //find way to filter that likes contains film id
        LikeTracker.find({ userId: { $in: friendsList } }, async (err, doc) => {
          try {
            if (err) throw err;
            const matchesList = doc.map((x) => {
              return x.userId;
            });
            User.find({ _id: { $in: matchesList } }, async (err, doc) => {
              try {
                if (err) throw err;
                const fullMatchesArray = doc.map((user) => {
                  return { id: user._id, username: user.username };
                });
                res.send({
                  msg: 'matches list',
                  matches: fullMatchesArray,
                });
              } catch (error) {
                console.log(error);
              }
            });
          } catch (error) {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  );
});

//GET a list of all movies liked by friends sorted from most to least likes
