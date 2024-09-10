/*
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Image URL
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  categoryIds: {
    type: [Number], // An array of category IDs
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User's ObjectId
    required: true,
    ref: 'User',
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

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
*/
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Image URL
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  categoryIds: {
    type: [Number], // An array of category IDs
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User
    required: true,
    ref: 'User',
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

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;