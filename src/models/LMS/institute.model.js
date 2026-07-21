const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const instituteSchema = new mongoose.Schema(
  {
    sl_no: { type: Number, unique: true },
    institute_name: { type: String, required: true, trim: true, unique: true },
    deletedAt: { type: Date, default: null }, // ✅ soft delete
  },
  { timestamps: true }
);

// Auto increment sl_no
instituteSchema.plugin(AutoIncrement, { inc_field: "sl_no" });

module.exports = mongoose.model("lms_institute", instituteSchema);
