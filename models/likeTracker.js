const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const likeTracker = new Schema({
  userId: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
  },
  dislikes: {
    type: Array,
    required: true,
  },
  filters: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('LikeTracker', likeTracker);
