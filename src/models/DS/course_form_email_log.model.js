const mongoose = require('mongoose');

const CourseFormEmailLogSchema = new mongoose.Schema({
    course_form_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseForm',
        required: true
    },
    email_type: {
        type: String,
        enum: ['resource_pack', 'review_link', 'welcome_message'],
        required: true
    },
    sent_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    },
    error_message: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CourseFormEmailLog', CourseFormEmailLogSchema);
