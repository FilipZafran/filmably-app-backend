const MovieList = require('../models/movieList');

module.exports = function fetchMoviesFromList(filter) {
  MovieList.findOne({ filterName: filter }, async (err, doc) => {
    try {
      if (err) throw err;
      if (!doc) return [];
      if (doc) {
        return doc['films'];
      }
    } catch (err) {
      console.log(err);
    }
  });
};
