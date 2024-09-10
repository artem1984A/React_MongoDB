const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ip: {
    ip: {
      type: String,
      required: true,
      default: '127.0.0.1',  // Default IP
    },
    accessCount: {
      type: Number,
      required: true,
      default: 1,  // Default to 1 access
    }
  }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;