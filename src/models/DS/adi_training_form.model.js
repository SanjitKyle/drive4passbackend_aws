const mongoose = require('mongoose');

const AdiTrainingFormSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    training_status: {
        type: String,
        enum: ['None', 'Started Part 1', 'Passed Part 1', 'Passed Part 2']
    },
        status: {
        type: String,
        default: 'New',
        enum: [
            'New',
            'Contacted',
            'Booked',
            'Waiting list',
            'No Response',
            'Test-Only Enquiry',
            'Passed to Office',
            'Quoted / Price Given',
            'Call Back Later',
            'Lost'
        ]
    },
    franchise_status: {
        type: String,
        enum: ['YES', 'NO']
    },
    postcode: {
        type: String
    },
    message: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstructorMaster'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AdiTrainingForm', AdiTrainingFormSchema);
