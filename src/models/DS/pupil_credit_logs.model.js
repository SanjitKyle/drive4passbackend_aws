const mongoose = require('mongoose');

const pupilCreditLogsSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'school',
      required: true,
      index: true,
    },

    pupil_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'pupil',
      required: true,
      index: true,
    },

    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking"
    },
    credit_hours: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      enum: ['sale', 'booking'],
      required: true,
    },


    deleted_at: {
      type: Date,
      default: null,
    },

    // Audit fields
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'pupil_credit_logs',
  pupilCreditLogsSchema
);
