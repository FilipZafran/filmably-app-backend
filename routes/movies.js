const express = require('express');
const router = express.Router();
const MovieList = require('../models/movieList');
const LikeTracker = require('../models/likeTracker');
const Friends = require('../models/friends');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const axios = require('axios');

const apiKey = process.env.IMDB_KEY;

router.post('/newList', (req, res) => {
  MovieList.findOne({ name: req.body.name }, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) res.send('list already exists');
      if (!doc) {
        const currentDate = new Date();
        const newMovieList = new MovieList({
          name: req.body.name,
          url: req.body.url,
          listId: req.body.listId,
          filterName: req.body.filterName,
          filterType: req.body.filterType,
          dateUpdated: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000),
        });
        await newMovieList.save();
        res.send(`"${req.body.name}" list created`);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.delete('movieList/:listName', (req, res) => {
  MovieList.findOneAndDelete(
    { name: req.params.listName },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (doc) res.send({ message: 'list deleted' });
        if (!doc) res.send({ message: 'list not found' });
      } catch (error) {
        console.log(error);
      }
    }
  );
});

router.get('movieList/:listName', ensureAuthenticated, (req, res) => {
  MovieList.findOne({ name: req.params.listName }, async (err, doc) => {
    try {
      if (err) throw err;
      if (!doc) res.send('no list found');
      if (doc) {
        /*const currentDate = new Date();
        const yesturday = currentDate.getTime() - 24 * 60 * 60 * 1000;
        if (doc.dateUpdated.getTime() < yesturday) {*/
        const response = await axios({
          method: 'GET',
          url: `${doc.url}/${apiKey}`,
        });
        MovieList.findOneAndUpdate(
          { name: req.params.listName },
          { $set: { films: response.data.items, dateUpdated: new Date() } },
          { useFindAndModify: false },
          async (err, doc) => {
            try {
              if (err) throw err;
              if (doc) res.send('list updated');
            } catch (error) {
              console.log(error);
            }
          }
        );
        /*} else {
          res.send(`list updated on ${doc.dateUpdated}`);
        }*/
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.get('/filterNames', (req, res) => {
  MovieList.find({}, async (err, doc) => {
    try {
      if (err) throw err;
      if (doc) {
        const genreArray = doc
          .filter((x) => {
            if (x.filterType === 'genre') return x;
          })
          .map((x) => x.filterName);
        const defaultArray = doc
          .filter((x) => {
            if (x.filterType === 'default') return x;
          })
          .map((x) => x.filterName);
        res.send({
          filters: { genreFilters: genreArray, defaultFilters: defaultArray },
        });
      }
      if (!doc) res.send('no entries found');
    } catch (error) {
      console.log(error);
    }
  });
});

router.get('/toSwipe', ensureAuthenticated, (req, res) => {
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
            for (let i; i < friendsArray.length; i++) {
              LikeTracker.findOne(
                { userId: friendsArray[i] },
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
            }
            for (let i; i < filters.length; i++) {
              MovieList.findOne({ filterName: filter[i] }, async (err, doc) => {
                try {
                  if (err) throw err;
                  if (doc) {
                    toSwipe = [...toSwipe, ...doc[films]];
                  }
                } catch (err) {
                  console.log(err);
                }
              });
            }
            MovieList.find({ filterType: 'default' }, async (err, doc) => {
              try {
                if (err) throw err;
                if (doc) {
                  doc.map((x) => {
                    toSwipe = [...toSwipe, ...x[films]];
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
              res.send(result);
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
