const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/usermodel');

router.get('/', async (req, res) => {
  const userId = req.session.userId; 
  if (!userId) {
    return res.redirect('/');  
  }

  try {
    const books = await Book.find({ available: true });
    res.render('availablebooks', { books, userId });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/borrow', async (req, res) => {
  const { bookId } = req.body;
  const userId = req.session.userId;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (!book.available) {
      return res.status(400).send('Book is already borrowed');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const alreadyBorrowed = user.borrowedBooks.some(b => b._id.toString() === book._id.toString());
    if (alreadyBorrowed) {
      return res.status(400).send('You have already borrowed this book');
    }

    user.borrowedBooks.push({
      _id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      borrowDate: new Date()
    });

    await user.save();

    await Book.updateMany({ title: book.title, author: book.author }, { available: false });

    res.redirect('/mybooks');
  } catch (err) {
    console.error('Error borrowing book:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;