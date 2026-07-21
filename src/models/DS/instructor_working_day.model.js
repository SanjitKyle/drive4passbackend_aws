const mongoose = require("mongoose");

const InstructorWorkingDaySchema = new mongoose.Schema(
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
    is_working: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    start_time: {
      type: String,
      required: function () {
        return this.is_working === 1;
      }, // HH:mm
    },
    end_time: {
      type: String,
      required: function () {
        return this.is_working === 1;
      },
    },
    break_start: {
      type: String,
      default: null,
    },
    break_end: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate days per instructor
 */
InstructorWorkingDaySchema.index(
  { instructor_id: 1, day_of_week: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InstructorWorkingDay",
  InstructorWorkingDaySchema
);
