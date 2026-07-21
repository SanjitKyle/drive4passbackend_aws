

const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true
    },

    pupil_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pupil",
        required: true
    },

    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstructorMaster",
        default: null
    },

    payment_method: {
        type: String,
        enum: ["cash", "card", "upi", "net_banking", "wallet"],
        default: "cash"
    },

    amount: {
        type: Number,
        required: true,
        min: 0
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

}, { timestamps: true });

module.exports = mongoose.model('money', MoneySchema);
