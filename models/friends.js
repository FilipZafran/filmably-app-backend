const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)

const Schema = mongoose.Schema;


const friends = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     index: true
    // },
    senderUserId: {
        type: String,
        required: true,
    },
    receiverUserId: {
        type: String,
        required: true,
    },
    accepted: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('friends', friends)