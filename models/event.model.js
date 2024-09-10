const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    default: 'Unknown Location'
  },
  categoryIds: {
    type: [Number],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User collection
    ref: 'User',
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;