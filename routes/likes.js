const express = require('express');
const router = express.Router();
const LikeTracker = require('../models/likeTracker');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//---------LIKETRACKER ROUTER------------------

router.put('/like', ensureAuthenticated, (req, res) => {
  LikeTracker.findOneAndUpdate(
    { userId: req.body.userId },
    { $push: { likes: req.body.film } },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`"${req.body.film['title']}" added to likes`);
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.body.userId,
            likes: [req.body.film],
            dislikes: [],
          });
          await newLikeTracker.save();
          res.send(`"${req.body.film['title']}" added to likes`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
});

router.put('/dislike', ensureAuthenticated, (req, res) => {
  LikeTracker.findOneAndUpdate(
    { userId: req.body.userId },
    { $push: { dislikes: req.body.film } },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`"${req.body.film['title']}" added to dislikes`);
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.body.userId,
            dislikes: [req.body.film],
            likes: [],
          });
          await newLikeTracker.save();
          res.send(`"${req.body.film['title']}" added to dislikes`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
});

router.get('/:userId/likes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.params.userId }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send({ userId: doc['userId'], likes: doc['likes'] });
      if (!doc) res.send('No entry found for this userId');
    } catch (err) {
      console.log(err);
    }
  });
});

router.get('/:userId/dislikes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.params.userId }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send({ userId: doc['userId'], dislikes: doc['dislikes'] });
      if (!doc) res.send('no entry found for this userId');
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
