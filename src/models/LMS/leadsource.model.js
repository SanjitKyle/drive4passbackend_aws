const mongoose = require("mongoose");

const LeadSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // prevent duplicates at DB level
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("lms_lead_source", LeadSourceSchema);
