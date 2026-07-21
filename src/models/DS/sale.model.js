const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true,
    },

    pupil_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pupil",
      required: true,
    },

    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "package_master",
      required: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },



    credited_hour: {
      type: Number,
      default: 0,
      min: 0,
      comment: "Hours purchased in this sale",
    },

    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "area",
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

module.exports = mongoose.model("Sale", SaleSchema);
