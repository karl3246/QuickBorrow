var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/usermodel');

router.get('/', function(req, res, next) {
  res.render('forgotpassword', { title: 'Forgot Password', error: null, message: null });
});

router.post('/', async function(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('forgotpassword', { title: 'Forgot Password', error: 'Email not found', message: null });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    const resetUrl = `http://${req.headers.host}/resetpassword?token=${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset - QuickBorrow Library',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
Please click on the following link, or paste this into your browser to complete the process:\n\n
${resetUrl}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    res.render('forgotpassword', { title: 'Forgot Password', error: null, message: 'An email has been sent with further instructions.' });
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.render('forgotpassword', { title: 'Forgot Password', error: 'Error sending reset email', message: null });
  }
});

module.exports = router;
