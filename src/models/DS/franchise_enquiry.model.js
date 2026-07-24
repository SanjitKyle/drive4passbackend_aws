const mongoose = require('mongoose');

const FranchiseEnquirySchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    instructor_type: {
        type: String,
        enum: ['ADI', 'PDI']
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
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Under review', 'Waiting list', 'Converted to Instructor', 'No response'],
        default: 'New'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FranchiseEnquiry', FranchiseEnquirySchema);
