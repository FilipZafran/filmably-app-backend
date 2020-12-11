const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieList = new Schema({
  name: {
    type: String,
    required: true,
  },
  filterName: { type: String, required: true },
  url: {
    type: String,
    required: true,
  },
  listId: {
    type: String,
  },
  dateUpdated: {
    type: Date,
    required: true,
  },
  films: {
    type: Array,
    required: true,
    default: [],
  },
  filterType: {
    type: String,
  },
});

module.exports = mongoose.model('MovieList', movieList);
