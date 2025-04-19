var express = require('express');
var router = express.Router();
var User = require('../models/usermodel'); 
var Book = require('../models/book');  

router.get('/', async function(req, res, next) {
  try {
    const userId = req.session.userId;  

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('mybooks', { borrowedBooks: user.borrowedBooks });
  } catch (err) {
    console.error('Error fetching borrowed books:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/return', async function(req, res, next) {
  try {
    const userId = req.session.userId;  
    const bookId = req.body.bookId;     

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const borrowedBook = user.borrowedBooks.find(b => b._id.toString() === bookId);
    if (!borrowedBook) return res.status(404).send('Borrowed book not found');

    user.borrowedBooks = user.borrowedBooks.filter(b => b._id.toString() !== bookId);
    await user.save();

    await Book.updateMany({ title: borrowedBook.title, author: borrowedBook.author }, { available: true });

    res.redirect('/mybooks');
  } catch (err) {
    console.error('Error returning the book:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
