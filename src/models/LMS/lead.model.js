const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    lead_gen_date: { type: Date, required: true },
    sl_no: { type: Number, unique: true },
    contact_person: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: null },
    mobile: { type: String, required: true },
    alt_mobile_no: { type: String, default: null },
    // email: { type: String, trim: true, validate: { validator: function (v) { if (!v) return true; return /^\S+@\S+\.\S+$/.test(v); }, message: "Invalid email format" }, default: null },
    email: { type: String, trim: true, default: null },    
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "course", default: null },
    lead_source_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_lead_source", default: null },
    lead_status_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_lead_status", default: null },
    lead_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_lead_type", default: null },
    institute_id: { type: mongoose.Schema.Types.ObjectId, ref: "lms_institute", default: null },
    followup_date: { type: Date, default: null },
    status: { type: Number, enum: [0, 1], default: 1 },
    asigned_user: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    last_update_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: "branch" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Auto-increment sl_no
leadSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastLead = await this.constructor.findOne().sort({ sl_no: -1 });
    this.sl_no = lastLead ? lastLead.sl_no + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("lms_lead", leadSchema);
