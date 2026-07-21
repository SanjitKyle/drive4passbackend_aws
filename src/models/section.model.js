const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Section', sectionSchema);
