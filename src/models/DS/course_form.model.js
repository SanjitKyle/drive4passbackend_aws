const mongoose = require('mongoose');

const CourseFormSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    course_interested: {
        type: String,
        enum: ['Not sure', '4 Weeks', '3 Weeks', '2 Weeks', '1 Week']
    },
    previous_lessons: {
        type: String,
        enum: ['0 previous lessons', '1-5 lessons', '5-10 lessons', '10+ lessons', '20+ lessons']
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual']
    },
    postcode: {
        type: String
    },
    additional_message: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CourseForm', CourseFormSchema);
