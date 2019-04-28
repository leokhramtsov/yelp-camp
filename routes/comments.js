const express = require('express');
//optional {mergeParams: true} if i want to export /campgrounds/:id/comments
// to app.js ensure :id is accessed
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// COMMENTS NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/newcomments', { campground: campground });
    }
  });
});

// COMMENTS CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash('error', 'Something went wrong.');
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash('success', 'Comment added.');
          res.redirect('/campgrounds/' + req.params.id);
        }
      });
    }
  });
});

// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found.');
      res.redirect('/campgrounds/');
    } else {
      Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
          res.redirect('back');
        } else {
          res.render('comments/edit', {
            campground_id: req.params.id,
            comment: comment
          });
        }
      });
    }
  });
});

// UPDATE COMMENT ROUTE
router.put('/:comment_id/', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DELETE COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;
