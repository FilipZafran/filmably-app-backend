const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)

const Schema = mongoose.Schema;

// import User from './user'
var Users = require('mongoose').model('User').schema
const friends = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     index: true
    // },
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // required: true,
    // [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

    receiverUserId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    // required: true,

    accepted: {
        type: Boolean,
        default: false,
        required: true
    },

    data: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

})

module.exports = mongoose.model('friends', friends)