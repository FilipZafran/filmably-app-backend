const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

//mongoDB automatically generates an _id for every entry we can use this as the userID

const user = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
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
});

module.exports = mongoose.model('User', user);
