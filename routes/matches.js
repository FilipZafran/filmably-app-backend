const express = require('express');
const router = express.Router();
const Friends = require('../models/friends.js');
const User = require('../models/user');
const LikeTracker = require('../models/likeTracker');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

//GET the friends who also like a specific movie

router.post('/oneFilm', ensureAuthenticated, (req, res) => {
  const film = req.body.film;
  const friendsList = req.body.allFriends;
  const friendIdArray = friendsList.map((x) => x.id);
  console.log('film: ', film);
  console.log('friendsList: ', friendsList);
  //fetch likeTracker for friends and filter for filmId
  LikeTracker.find({ userId: { $in: friendIdArray } }, async (err, doc) => {
    try {
      if (err) throw err;
      // console.log('doc: ', doc);
      const matchesList = doc
        .map((userLikeTracker) => {
          const like = userLikeTracker.likes.filter(
            (x) => x.film && x.film.id === film.id
          );
          console.log('like: ', like);
          if (like.length > 0) {
            return userLikeTracker.userId;
          } else {
            return 'false';
          }
        })
        .filter((x) => x !== 'false');
      // console.log('matchlist: ', matchesList);
      //get username from userid
      const matchesListWithNames = matchesList
        .map((match) => friendsList.filter((friend) => friend.id === match))
        .flat();
      console.log('matchesListWithNames: ', matchesListWithNames);
      res.send({
        msg: 'matches list',
        movie: film,
        matches: matchesListWithNames,
      });
    } catch (error) {
      console.log(error);
    }
  });
});

//GET a list of all movies liked by friends sorted from most to least likes

// router.get('/allFilms', ensureAuthenticated, (req, res) => {});

module.exports = router;
