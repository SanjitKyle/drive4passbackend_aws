const mongoose = require('mongoose');

const PackageMasterSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true
    },
    package_name: {
      type: String,
      required: true,
      trim: true,
    },
    package_slug: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "area",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('package_master', PackageMasterSchema);
