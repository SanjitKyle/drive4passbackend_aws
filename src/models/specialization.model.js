const mongoose = require('mongoose');

const SpecializationSchema = new mongoose.Schema({
  specialization_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Specialization', SpecializationSchema);
