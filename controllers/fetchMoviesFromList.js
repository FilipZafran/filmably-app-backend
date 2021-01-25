const MovieList = require('../models/movieList');

module.exports = function fetchMoviesFromList(filter, moviesList) {
  MovieList.findOne({ filterName: filter }, async (err, doc) => {
    try {
      if (err) throw err;
      if (!doc) return [];
      if (doc) {
        console.log('inside');
        moviesList = [...moviesList, ...doc.films];
        return moviesList;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};
