const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// routes setup
router.get('/', function(req, res) {
  res.render('landing');
});

// ============================
// AUTH ROUTES
// ============================
// show register form
router.get('/register', function(req, res) {
  res.render('register', { page: 'register' });
});

// handle sign up logic
router.post('/register', function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to YelpCamp ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

// show login form
router.get('/login', function(req, res) {
  res.render('login', { page: 'login' });
});

// handle user login logic
// app.post('login', middleware, callback)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/register'
  }),
  function(req, res) {}
);

// handle logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/campgrounds');
});

module.exports = router;
