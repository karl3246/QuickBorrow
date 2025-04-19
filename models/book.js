const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  available: { type: Boolean, default: true }
});

// para sa pagiging unique ng libro or iwas duplicate
bookSchema.index({ title: 1, author: 1 }, { unique: true });

// moedl for Book collection
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
