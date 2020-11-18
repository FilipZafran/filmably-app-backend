const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)

const Schema = mongoose.Schema;

//mongoDB automatically generates an _id for every entry we can use this as the userID

const user = new Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
  },
  // fields: { type: [String], index: true }

});

// user.index({ username: "text" })

module.exports = mongoose.model('User', user);
