const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school"
    },
    title: {
        type: String
    },
    repeat: {
        type: String,
        enum: ['repeat', 'norepeat'],
        default: 'repeat'

    },

    gearbox: {
        type: String,
        enum: ['manual', 'automatic'],
        default: 'manual'
    },
    pickup: {
        type: String
    },
    dropoff: {
        type: String
    },
    private_notes: {
        type: String
    },
    pupil_summary: {
        type: String
    },
    pupil_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pupil"
    },
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstructorMaster"
    },
    booking_date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["booking_request", "pending", "booked", "completed", "cancelled"],
        default: "booking_request"

    },
    credit_use: {
        type: Number,

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
}, { timestamps: true })

module.exports = mongoose.model('booking', BookingSchema);