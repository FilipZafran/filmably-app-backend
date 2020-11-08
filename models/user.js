const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//mongoDB automatically generates an _id for every entry we can use this as the userID

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', user);
