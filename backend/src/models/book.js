const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    image: String,
    title: String,
    link: String,
    description: String,
    price: Number,
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author',
    },
});

const Book = mongoose.model('book', bookSchema);

module.exports = Book;
