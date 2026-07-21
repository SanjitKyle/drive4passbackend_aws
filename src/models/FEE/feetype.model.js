const mongoose = require("mongoose");

const FeeTypeSchema = new mongoose.Schema({
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch', required: true},
    feetype_name: { type: String, required: true, unique: true },
    description: { type: String },
    late_fee: {
        type: Number,
        required: true,
        default: 0
    },
    last_due_after_days: {
        type: Number,
        enum: [5, 10, 15, 20, 25, -1],
        required: true,
        default: -1
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1 // 1 = Active, 0 = Inactive
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("feetype", FeeTypeSchema);
