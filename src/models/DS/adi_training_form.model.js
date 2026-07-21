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
    franchise_status: {
        type: String,
        enum: ['YES', 'NO']
    },
    postcode: {
        type: String
    },
    message: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AdiTrainingForm', AdiTrainingFormSchema);
