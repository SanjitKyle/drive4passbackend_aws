const mongoose = require('mongoose');

const GapSchema = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school"
    },
    date: {
        type: Date
    },
    start_time: {
        type: String
    },
    duration_hours: {
        type: Number,
        default: 0
    },
    duration_minutes: {
        type: Number,
        default: 0
    },
    duration_formatted: {
        type: String
    },
    duration: {
        type: mongoose.Schema.Types.Mixed
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstructorMaster",
        default: null
    },
    color: {
        type: String,
        default: null,
    }
}, { timestamps: true });

module.exports = mongoose.model('Gap', GapSchema);