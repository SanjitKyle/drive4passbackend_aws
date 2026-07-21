const mongoose = require("mongoose");

const FeeInstallmentSchema = new mongoose.Schema(
{
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
        required: true
    },

    admission_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admission",
        required: true
    },

    fee_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feetype",
        required: true
    },

    due_date: {
        type: Date,
        required: true
    },

    last_due_date: {
        type: Date,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    late_fee: {
        type: Number,
        default: 0
    },

    is_late_fee_applied: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ["Due", "Paid", "Overdue"],
        default: "Due"
    },

    paid_at: {
        type: Date,
        default: null
    },

    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fee_payment",
        default: null
    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{ timestamps: true }
);

/**
 * Prevent duplicate fee entries
 * Same admission + fee type + due date
 */
FeeInstallmentSchema.index(
  { admission_id: 1, fee_type_id: 1, due_date: 1 },
  { unique: true }
);

module.exports = mongoose.model("fee_installments", FeeInstallmentSchema);
