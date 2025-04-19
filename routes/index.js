const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login', error: null });
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', email);  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.status(401).render('index', { title: 'Login', error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Incorrect password');
      return res.status(401).render('index', { title: 'Login', error: 'Incorrect password' });
    }

    req.session.userId = user._id;

    console.log('Login successful');

    res.json({
      success: true,
      fullName: `${user.firstName} ${user.middleInitial ? user.middleInitial + ' ' : ''}${user.lastName}`,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('index', { title: 'Login', error: 'Something went wrong' });
  }
});


router.post('/logout', function(req, res, next) {
  console.log("Logout route hit");
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
