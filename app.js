const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const User = require('./models/user');

const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

const app = express();

const dburl = process.env.MONGODB_URL || 'mongodb://localhost/yelpcamp';
mongoose.connect(dburl);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.set('view engine', 'ejs');

app.use(
  require('express-session')({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// use static serialize and deserialize of model for passport session support - these passport methods become User methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/', indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('YelpCamp server started...');
});
