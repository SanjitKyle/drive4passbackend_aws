const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    pupil_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pupil',
        required: true
    },
    transfer_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstructorMaster',
        required: true
    },
    transfer_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstructorMaster',
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);