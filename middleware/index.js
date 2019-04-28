const Campground = require('../models/campground');
const Comment = require('../models/comment');

const checkCampgroundOwnership = function(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
        if (!foundCampground) {
          req.flash('error', 'Campground not found.');
          return res.redirect('back');
        }

        // check if user owns the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      }
    });
    // if not logged in
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

const checkCommentOwnership = function(req, res, next) {
  // is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        // check if user owns the campground
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      }
    });
    // if not logged in
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

// check if logged in middleware
const isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that.');
  res.redirect('/login');
};

module.exports = {
  checkCampgroundOwnership,
  checkCommentOwnership,
  isLoggedIn
};
