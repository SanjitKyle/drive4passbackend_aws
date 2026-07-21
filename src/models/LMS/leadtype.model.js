const mongoose = require("mongoose");

const LeadTypeSchema = new mongoose.Schema(
  {
    type_name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    created_by: {
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true, collection: "lms_lead_type" }
);

module.exports = mongoose.model("lms_lead_type", LeadTypeSchema);
