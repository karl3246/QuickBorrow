var express = require('express');
var router = express.Router();
const User = require('../models/usermodel');
const nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
  res.render('welcome', { title: 'Express' });
});

router.post('/update-profile', async function(req, res, next) {
  try {
    const userId = req.session.userId;
    const { firstName, lastName, middleInitial } = req.body;

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      middleInitial
    });

    res.status(200).send('Profile updated successfully');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/support', async function(req, res, next) {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).send('Message cannot be empty');
  }

  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      replyTo: user.email, 
      to: process.env.EMAIL_USER,
      subject: 'Library Support Message',
      text: `Support message from user: ${user.email}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('Support message sent successfully');
  } catch (err) {
    console.error('Error sending support message:', err);
    res.status(500).send('Failed to send support message');
  }
});

module.exports = router;
