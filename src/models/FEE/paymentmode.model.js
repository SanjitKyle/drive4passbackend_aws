const mongoose = require("mongoose");

const PaymentModeSchema = new mongoose.Schema(
{
    paymentmode_name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
    deletedAt: { type: Date, default: null } // Soft delete
},
{ timestamps: true } // Auto createdAt & updatedAt
);

module.exports = mongoose.model("payment_modes", PaymentModeSchema);
