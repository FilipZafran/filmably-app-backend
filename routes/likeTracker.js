const express = require('express');
const router = express.Router();
const LikeTracker = require('../models/likeTracker');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//---------LIKETRACKER ROUTER------------------

router.put('/like', ensureAuthenticated, (req, res) => {
  LikeTracker.findOneAndUpdate(
    { userId: req.user.id },
    { $push: { likes: { date: new Date(), film: req.body.film } } },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`"${req.body.film['title']}" added to likes`);
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.user.id,
            likes: [{ date: new Date(), film: req.body.film }],
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
    { userId: req.user.id },
    { $push: { dislikes: { date: new Date(), film: req.body.film } } },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`"${req.body.film['title']}" added to dislikes`);
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.user.id,
            dislikes: [{ date: new Date(), film: req.body.film }],
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

router.get('/likes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send({ likes: doc['likes'] });
      if (!doc) res.send({ likes: [] });
    } catch (err) {
      console.log(err);
    }
  });
});

router.get('/dislikes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send({ dislikes: doc['dislikes'] });
      if (!doc) res.send({ dislikes: [] });
    } catch (err) {
      console.log(err);
    }
  });
});

router.delete('/likes', ensureAuthenticated, (req, res) => {
  LikeTracker.update(
    { userId: req.user.id },
    {
      $pull: {
        likes: { film: { id: req.body.filmIds } },
      },
    },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send('entry pulled');
        if (!doc) res.send(`entry not found`);
      } catch (err) {
        console.log(err);
      }
    }
  );
});

router.delete('/dislikes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { dislikes: { film: { id: { $in: req.body.filmId } } } } },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`removed from dislikes`);
        if (!doc) res.send(`entry not found`);
      } catch (err) {
        console.log(err);
      }
    }
  );
});

//{"filmIds": ["tt1130884", "tt4729430","tt0035446"]}
//{"username":"Admin", "password":"password"}

module.exports = router;
