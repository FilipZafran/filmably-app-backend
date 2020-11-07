const mongoose = require("mongoose");

//mongoDB automatically generates an _id for every entry we can use this as the userID

const user = new mongoose.Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model("User", user);
