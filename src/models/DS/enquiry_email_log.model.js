const mongoose = require('mongoose');

const EnquiryEmailLogSchema = new mongoose.Schema({
    enquiry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enquire',
        required: true
    },
    email_type: {
        type: String,
        enum: ['resource_pack', 'review_link', 'welcome_message'],
        required: true
    },
    sent_at: {
        type: Date,
        default: Date.now
    },
    sent_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EnquiryEmailLog', EnquiryEmailLogSchema);
