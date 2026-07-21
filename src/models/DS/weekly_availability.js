const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema({
  breakStart: { type: String }, // HH:mm 24-hour format
  breakEnd: { type: String }
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  workStart: { type: String },
  workEnd: { type: String },
  breaks: [breakSchema]
});

const instructorAvailabilitySchema = new mongoose.Schema({
  instructorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Instructor" },
  weeklyAvailability: [daySchema],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("InstructorAvailability", instructorAvailabilitySchema);
