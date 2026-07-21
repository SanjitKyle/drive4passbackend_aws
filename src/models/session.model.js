const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // e.g., "2024-25", "Jan-Jun 2025"
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
