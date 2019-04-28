const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//INDEX ROUTE - display all campgrounds
router.get('/', function(req, res) {
  Campground.find({}, function(err, allcampgrounds) {
    if (err) {
      console.log('error occured');
    } else {
      res.render('campgrounds/index', {
        campgrounds: allcampgrounds,
        page: 'campgrounds'
      });
    }
  });
});

//CREATE ROUTE - create/add new campground
router.post('/', middleware.isLoggedIn, function(req, res) {
  const name = req.body.name;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: name,
    image: image,
    price: price,
    description: description,
    author
  };

  Campground.create(newCampground, function(err, campground) {
    if (err) {
      console.log('error occured');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// NEW ROUTE - display form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/newcamp');
});

// SHOW ROUTE - shows more info about one campground
router.get('/:id', function(req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found.');
        res.redirect('/campgrounds');
      } else {
        //render show template for found campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT ROUTE - form to edit campgrounds
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, campground) {
    res.render('campgrounds/edit', { campground: campground });
  });
});

// UPDATE ROUTE - updating edited data for campground
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  req.body.campground.body = req.sanitize(req.body.campground.body);
  const id = req.params.id;
  const campgroundData = req.body.campground;
  Campground.findByIdAndUpdate(id, campgroundData, function(err, campground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + id);
    }
  });
});

// DELETE ROUTE - deleting campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
