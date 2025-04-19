require('dotenv').config();  // Load environment variables from .env file

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');  // Import mongoose
var session = require('express-session'); // Import session
var flash = require('connect-flash'); // Import connect-flash for flash messages

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var forgotpasswordRouter = require('./routes/forgotpassword');
var resetpasswordRouter = require('./routes/resetpassword');
var welcomeRouter = require('./routes/welcome');
var availablebooksRouter = require('./routes/availablebooks');
var mybooksRouter = require('./routes/mybooks');

var app = express();

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/library', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up logging, cookies, body parsing, static files, and session
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session and flash
app.use(session({
  secret: 'your-secret-key', // You should replace this with your own secret key
  resave: false,
  saveUninitialized: true
}));
app.use(flash()); // Initialize connect-flash

// Route mounting
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use('/resetpassword', resetpasswordRouter);
app.use('/welcome', welcomeRouter);
app.use('/availablebooks', availablebooksRouter);
app.use('/mybooks', mybooksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;