const express = require('express');

const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const LikeTracker = require('../models/likeTracker');
const Friends = require('../models/friends');
const MovieList = require('../models/movieList');

// still need to fetch list of friends, fetch movies liked by friends, add movies liked by friends to array

router.get('/', ensureAuthenticated, (req, res) => {
  // fetch all active filters and list of already swiped movies saved in user's likeTracker
  LikeTracker.findOne({ userId: req.user.id }, async (err, doc) => {
    try {
      if (err) throw err;
      const filters = doc
        ? [...doc.filters.genreFilters, ...doc.filters.timeFilters]
        : [];
      const alreadySwiped = doc
        ? [...doc.likes, ...doc.dislikes]
            .map((x) => x.film)

            // there are null objects ocassionally need to handel this and figure out why
            .map((x) => x != null && x)
        : [];

      // fetch list of friends

      // fetch all movies in lists by active filter as well as default filters
      MovieList.find(
        { $or: [{ filterName: { $in: filters } }, { filterType: 'default' }] },
        async (err, doc) => {
          try {
            if (err) throw err;
            if (!doc) return [];
            if (doc) {
              const temp = doc.map((x) => x.films);
              const flatten = (x) => {
                let result = [];
                x.map((element) => (result = [...result, ...element]));
                return result;
              };
              const moviesList = flatten(temp);

              // fetch lists of movies liked by friends and add to moviesList

              // remove duplicates
              const makeUnique = (list) => {
                const unique = [];
                while (list.length > 0) {
                  const movie = list.shift();
                  if (list.find((x) => x.id === movie.id) === undefined) {
                    unique.push(movie);
                  }
                }
                return unique;
              };

              const uniqueList = makeUnique(moviesList);

              // remove films already swiped by user
              const removeSwiped = (list, swipe) => {
                if (swipe.length < 1) {
                  return list;
                }
                const result = [];
                while (list.length > 0) {
                  const movie = list.shift();
                  if (swipe.find((x) => x.id === movie.id) === undefined) {
                    result.push(movie);
                  }
                }
                return result;
              };
              const toSwipe = removeSwiped(uniqueList, alreadySwiped);

              // randomize array
              const randomize = (array) => {
                const result = [];
                while (array.length > 0) {
                  const randomIndex = Math.floor(Math.random() * array.length);
                  result.push(array[randomIndex]);
                  array.splice(randomIndex, 1);
                }
                return result;
              };
              const randomizedToSwipe = randomize(toSwipe);

              // send resulting array to frontEnd
              res.send(randomizedToSwipe);
            }
          } catch (err) {
            console.log(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
