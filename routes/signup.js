var express = require('express');
var router = express.Router();
const User = require('../models/usermodel'); 
const bcrypt = require('bcryptjs');  

router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Sign Up', error: null });
});

router.post('/', async (req, res) => {
  const { firstName, lastName, middleInitial, email, password, birthday } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('signup', { title: 'Sign Up', error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      middleInitial,  
      email,
      password: hashedPassword,  
      birthday
    });

    await newUser.save();

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('signup', { title: 'Sign Up', error: 'Something went wrong during registration' });
  }
});

module.exports = router;