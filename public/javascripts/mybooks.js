router.post('/return', async function(req, res) {
  try {
    const bookId = req.body.bookId;
    const userId = req.session.userId;
    
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    
    if (!user || !book) {
      return res.status(404).send('User or book not found');
    }
    
    user.borrowedBooks = user.borrowedBooks.filter(b => b.toString() !== bookId.toString());
    await user.save();
    
    book.available = true;
    await book.save();
    
    res.redirect('/mybooks');
  } catch (err) {
    console.error('Error returning book:', err);
    res.status(500).send('Internal Server Error');
  }
});
