const mongoose = require("mongoose");

const InstructorWorkingHourSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true,
      index: true,
    },
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstructorMaster",
      required: true,
      index: true,
    },
    day_of_week: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    start_time: {
      type: String,
      required: true, // HH:mm
    },
    end_time: {
      type: String,
      required: true,
    },
    break_start: {
      type: String,
    },
    break_end: {
      type: String,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model(
  "InstructorWorkingHour",
  InstructorWorkingHourSchema
);
