const mongoose = require('mongoose');

// Campground schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  author: {
    id: mongoose.Schema.Types.ObjectId,
    username: String
  }
});

module.exports = mongoose.model('Campground', campgroundSchema);
