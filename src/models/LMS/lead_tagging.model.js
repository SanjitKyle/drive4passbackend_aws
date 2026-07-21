const mongoose = require("mongoose");

const leadTaggingSchema = new mongoose.Schema(
  {
    sl_no: { type: Number, unique: true },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_lead", required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    // lead_status_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_lead_status", required: true },
    lead_status_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_lead_status"},
    next_flowup_date: { type: Date, default: null },
    remarks: { type: String, trim: true, default: "" }
  },
  {
    timestamps: true,
  }
);

leadTaggingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastRecord = await this.constructor.findOne().sort({ sl_no: -1 });
    this.sl_no = lastRecord ? lastRecord.sl_no + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("lms_lead_tagging", leadTaggingSchema);
