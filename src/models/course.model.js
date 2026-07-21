const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true, unique: true},
  duration_months: {type: Number, required: true},
  fees: {type: Number, required: true},
}, { timestamps: true });

module.exports = mongoose.model('course', CourseSchema);
