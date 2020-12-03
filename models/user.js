const mongoose = require('mongoose');

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
  data: {
    type: Object,
    required: true,
    default: { email: '' },
  },
  GDPR: {
    type: Boolean,
    default: false
  }

});
mongoose.set('useCreateIndex', true)
user.index({ username: 'text' })

module.exports = mongoose.model('User', user);
