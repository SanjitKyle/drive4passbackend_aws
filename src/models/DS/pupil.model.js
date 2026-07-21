const mongoose = require("mongoose");

const PupilSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "area",
      required: false,
    },
    total_packages_price: {
      type: Number,
    },
    remaining_hour: {
      type: Number,
    },
    total_credit: {
      type: Number,
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "package_master",
    },

    email: {
      type: String,
      required: true,
      trim: true,

      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },

    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstructorMaster",
   
    },

    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true, // auto-filled from instructor
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
    active: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PupilSchema.virtual("total_credit_used").get(function () {
  const total = this.total_credit || 0;
  const remaining = this.remaining_hour || 0;
  return total - remaining;
});

module.exports = mongoose.model("pupil", PupilSchema);
