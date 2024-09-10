const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,  // Ensure each user has a unique id
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
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

const User = mongoose.model('User', userSchema);
module.exports = User;