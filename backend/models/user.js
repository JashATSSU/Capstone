const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
