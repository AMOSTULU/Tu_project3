const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdTime: {
        type: Date,
        default: Date.now
    },
    updatedTime: {
        type: Date
    },
    image: {
        type: String 
    }
});

module.exports = mongoose.model('Tweet', tweetSchema);
