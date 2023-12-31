const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    registerDate: Date
});

module.exports = mongoose.model('User', userSchema);
