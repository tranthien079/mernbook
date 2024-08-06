const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
});

const Author = mongoose.model('author', authorSchema);

module.exports = Author;
