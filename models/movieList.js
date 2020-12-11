const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieList = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  listId: {
    type: String,
    required: true,
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: new Date(),
  },
  films: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('MovieList', movieList);
