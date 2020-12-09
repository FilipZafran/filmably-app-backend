const MovieList = require('../models/movieList');

module.exports = function fetchMoviesFromList(filter, moviesList) {
  MovieList.findOne({ filterName: filter }, async (err, doc) => {
    try {
      if (err) throw err;
      if (!doc) return [];
      if (doc) {
        moviesList = [...moviesList, ...doc['films']];
      }
    } catch (err) {
      console.log(err);
    }
  });
};
