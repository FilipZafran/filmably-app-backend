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
        // [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    receiverUserId: {
        type: String,
        required: true,
    },
    accepted: {
        type: Boolean,
        default: false,
        required: true
    }

})

module.exports = mongoose.model('friends', friends)