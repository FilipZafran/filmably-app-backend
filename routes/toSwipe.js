const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const LikeTracker = require('../models/likeTracker');
const Friends = require('../models/friends');
const MovieList = require('../models/movieList');

router.get('/', ensureAuthenticated, (req, res) => {
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      const filters = doc
        ? [...doc['filters']['genreFilters'], ...doc['filters']['timeFilters']]
        : [];
      const alreadySwiped = doc
        ? [...doc['likes'], ...doc['dislikes']].map((x) => x.film)
        : [];
      Friends.find(
        {
          $and: [
            { accepted: true },
            {
              $or: [
                { senderUserId: req.user.id },
                { receiverUserId: req.user.id },
              ],
            },
          ],
        },
        async (err, doc) => {
          try {
            if (err) throw err;
            const friendsArray = !doc
              ? []
              : doc.map((x) => {
                  if (x.senderUserId === req.user.id) {
                    return x.receiverUserId;
                  } else return x.senderUserId;
                });
            let toSwipe = [];

            //FIND ALL
            LikeTracker.findOne(
              { userId: friendsArray /*find ALL */ },
              async (err, doc) => {
                try {
                  if (err) throw err;
                  if (doc) {
                    const likes = doc['likes'].map((x) => x['film']);
                    toSwipe = [...toSwipe, ...likes];
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            );

            for (let i; i < filters.length; i++) {
              console.log('here');
              MovieList.findOne(
                { filterName: filters[i] },
                async (err, doc) => {
                  try {
                    if (err) throw err;
                    if (doc) {
                      toSwipe = [...toSwipe, ...doc['films']];
                      res.send({ swipe: toSwipe });
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }
              );
            }
            console.log({ filter: toSwipe.length });
            MovieList.find({ filterType: 'default' }, async (err, doc) => {
              try {
                if (err) throw err;
                if (doc) {
                  doc.map((x) => {
                    toSwipe = [...toSwipe, ...x['films']];
                  });
                }
              } catch (err) {
                console.log(err);
              }
            });
            let uniqueToSwipe = [];
            while (toSwipe.length > 0) {
              const movie = toSwipe.shift();
              if (toSwipe.indexOf(movie) > -1) {
                uniqueToSwipe.push(movie);
              }
            }

            //GET LIKES AND DISLIKES ARRAY AND REMOVE THEM FROM UNIQUETOSWIPE
            //TAKE 100 RANDOM ENTRIES AND SEND TO FRONTEND
            for (let i; i < alreadySwiped.length; i++) {
              const index = uniqueToSwipe.indexOf(alreadySwiped[i]);
              uniqueToSwipe.splice(index, 1);
            }

            if (uniqueToSwipe <= 100) {
              res.send(uniqueToSwipe);
            } else {
              const result = [];
              for (let i = 0; i < 100; i++) {
                result.push(
                  uniqueToSwipe[
                    Math.floor(Math.random() * uniqueToSwipe.length)
                  ]
                );
              }
              res.send({ result: result });
            }
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
