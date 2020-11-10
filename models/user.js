const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//mongoDB automatically generates an _id for every entry we can use this as the userID

const user = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", user);

/*
username:
profile photo:
email:
first:
last name:
_id:
bio:
account opened(timestamp):
last logged in(timestamp):
age:
favorite movie quote:
favorite movie:


movie likes:
movie dislikes:
friends:
movie filters:
movie filters current:

currently logged On:
chat history:

*/
