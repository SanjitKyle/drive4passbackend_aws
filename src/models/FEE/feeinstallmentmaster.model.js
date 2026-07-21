const mongoose = require("mongoose");

const FeeInstallmentMasterSchema = new mongoose.Schema(
{
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch' },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },	

    fee_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "feetype",
            required: true
        },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    /**
     * Example:
     * [4,5,6,7,8,9,10,11,12,1,2,3]
     * Stored as numbers only
     */
    installment_months: {
        type: [Number],
        required: true,
        validate: {
            validator: function (months) {
                return months.every(m => m >= 1 && m <= 12);
            },
            message: "Installment months must be between 1 and 12"
        }
    },

    status: {
        type: Number, // 1 = active, 0 = inactive
        default: 1
    },

    last_updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
);

/**
 * 🔒 Prevent duplicate Fee Type for same Course
 * Example: Tuition Fee should not repeat for same course
 */
FeeInstallmentMasterSchema.index(
    { course_id: 1, fee_type_id: 1, deletedAt: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "fee_installment_master",
    FeeInstallmentMasterSchema
);
