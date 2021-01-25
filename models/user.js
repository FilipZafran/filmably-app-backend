const mongoose = require('mongoose');

const { Schema } = mongoose;

// mongoDB automatically generates an _id for every entry we can use this as the userID

const user = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  age: {
    type: String,
  },

  city: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  registeredAt: {
    type: Date,
    required: true,
    default: new Date(),
  },

  lastLoggedIn: {
    type: Date,
  },

  picture: {
    type: String,
  },
  // for password reset
  resetToken: {
    type: String,
  },
  expireToken: {
    type: String,
  },
});
mongoose.set('useCreateIndex', true);
user.index({ username: 'text' });

module.exports = mongoose.model('User', user);
