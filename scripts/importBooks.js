const mongoose = require('mongoose');
const Book = require('../models/book');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');

  let books = JSON.parse(fs.readFileSync('./books.json', 'utf-8'));

  books = books.map(book => ({
    ...book,
    available: true
  }));

  books = books.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.title === value.title && t.author === value.author
    ))
  );

  return Book.insertMany(books);
})
.then(() => {
  console.log('Books imported successfully!');
  mongoose.connection.close();
})
.catch((error) => {
  console.error('Error importing books:', error);
  mongoose.connection.close();
});
