const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleInitial: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  borrowedBooks: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      title: String,
      author: String,
      genre: String,
      borrowDate: Date 
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;