const express = require('express');

const router = express.Router();
const LikeTracker = require('../models/likeTracker');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// ---------LIKETRACKER ROUTER------------------

router.put('/like', ensureAuthenticated, (req, res) => {
  LikeTracker.findOneAndUpdate(
    { userId: req.user.id },
    {
      $push: {
        likes: { date: new Date(), film: req.body.film },
      },
    },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`"${req.body.film.title}" added to likes`);
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.user.id,
            likes: [{ date: new Date(), film: req.body.film }],
            dislikes: [],
            filters: {},
          });
          await newLikeTracker.save();
          res.send(`"${req.body.film.title}" added to likes`);
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
    {
      $push: {
        dislikes: { date: new Date(), film: req.body.film },
      },
    },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send(`"${req.body.film.title}" added to dislikes`);
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.user.id,
            dislikes: [{ date: new Date(), film: req.body.film }],
            likes: [],
            filters: {},
          });
          await newLikeTracker.save();
          res.send(`"${req.body.film.title}" added to dislikes`);
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
      if (doc) {
        const likesArray = doc.likes.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );
        res.send({ likes: likesArray });
      }
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
      if (doc) {
        const dislikesArray = doc.dislikes.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );
        res.send({ dislikes: dislikesArray });
      }
      if (!doc) res.send({ dislikes: [] });
    } catch (err) {
      console.log(err);
    }
  });
});

router.get('/filters', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) {
        res.send({ filters: doc.filters });
      }
      if (!doc) res.send({ filters: {} });
    } catch (err) {
      console.log(err);
    }
  });
});

// DELETE "likeTracker/likes"
// {"films": [{film object}, {film object}, {film object}]}

router.delete('/likes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) {
        const filterLikes = (likesArray, filmArray) => {
          let index;
          for (let i = 0; i < filmArray.length; i += 1) {
            index = likesArray.findIndex((x) => x.film.id === filmArray[i].id);
            if (index > -1) {
              likesArray.splice(index, 1);
            }
          }
          return likesArray;
        };
        const newLikesArray = await filterLikes(
          [...doc.likes],
          [...req.body.films]
        );
        const datedFilmArray = await req.body.films.map((x) => ({
          date: new Date(),
          film: x,
        }));
        LikeTracker.findOneAndUpdate(
          { userId: req.user.id },
          {
            $set: { likes: newLikesArray },
            $push: { dislikes: { $each: datedFilmArray } },
          },
          { useFindAndModify: false },
          async (err, doc) => {
            try {
              if (err) throw err;
              if (doc) {
                res.send('removed from likes');
              }
              if (!doc) res.send('entry not found');
            } catch (err) {
              console.log(err);
            }
          }
        );
      }
      if (!doc) res.send(`entry not found`);
    } catch (err) {
      console.log(err);
    }
  });
});

// DELETE "likeTracker/dislikes"
// {"films": [{film object}, {film object}, {film object}]}

router.delete('/dislikes', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) {
        const filterDislikes = (dislikesArray, filmArray) => {
          let index;
          for (let i = 0; i < filmArray.length; i += 1) {
            index = dislikesArray.findIndex(
              (x) => x.film.id === filmArray[i].id
            );
            if (index > -1) {
              dislikesArray.splice(index, 1);
            }
          }
          return dislikesArray;
        };
        const newDislikesArray = await filterDislikes(
          [...doc.dislikes],
          [...req.body.films]
        );
        const datedFilmArray = await req.body.films.map((x) => ({
          date: new Date(),
          film: x,
        }));
        LikeTracker.findOneAndUpdate(
          { userId: req.user.id },
          {
            $set: { dislikes: newDislikesArray },
            $push: { likes: { $each: datedFilmArray } },
          },
          { useFindAndModify: false },
          async (err, doc) => {
            try {
              if (err) throw err;
              if (doc) {
                res.send('removed from dislikes');
              }
              if (!doc) res.send('entry not found');
            } catch (err) {
              console.log(err);
            }
          }
        );
      }
      if (!doc) res.send(`entry not found`);
    } catch (err) {
      console.log(err);
    }
  });
});

// POST "/likeTracker/filters"
// {"filters": {filter object}} sets the new filters

router.post('/filters', ensureAuthenticated, (req, res) => {
  LikeTracker.findOneAndUpdate(
    { userId: req.user.id },
    { $set: { filters: req.body.filters } },
    { useFindAndModify: false },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send('filters updated');
        if (!doc) {
          const newLikeTracker = new LikeTracker({
            userId: req.user.id,
            dislikes: [],
            likes: [],
            filters: req.body.filters,
          });
          await newLikeTracker.save();
          res.send('filters updated');
        }
      } catch (err) {
        console.log(err);
      }
    }
  );
});

module.exports = router;
