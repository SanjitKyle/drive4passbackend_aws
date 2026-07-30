const mongoose = require('mongoose');

const AwaySchema = new mongoose.Schema(
    {
        school_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "school",
            required: true
        },
        instructor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InstructorMaster",
            required: true
        },
        date: {
            type: Date
        },
        start_time: {
            type: String,
            required: true
        },
        end_time: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null
        },
        color: {
            type: String,
            default: null,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Away', AwaySchema);
