var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/usermodel');

router.get('/', async function(req, res, next) {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Invalid or missing token');
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    res.render('resetpassword', { title: 'Reset Password', token: token, error: null });
  } catch (err) {
    console.error('Error in reset password GET:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', async function(req, res, next) {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).send('Invalid or missing token');
  }

  if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
    return res.render('resetpassword', { title: 'Reset Password', token: token, error: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.redirect('/');
  } catch (err) {
    console.error('Error in reset password POST:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
