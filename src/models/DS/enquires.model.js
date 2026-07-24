const mongoose = require('mongoose');

const EnquireSchema = new mongoose.Schema({
    name: {
        type: String
    
    },

    phone: {
        type: String
    
    },

    email: {
        type: String
    },

    postcode: {
        type: String
    },

  
    driving_experience: {
        type: String,
        enum: ['Beginner', 'Some Experience', 'Experienced']
    },
    
   
      type_of_training: {
        type: String,
        enum: [
            'Car Driving Lessons',
            'Automatic Car Lessons',
            'Manual Car Lessons',
            'Refresher Lessons',
            'Intensive Course'
        ]
    },

    licence: {
        type: String,
        enum: ['Yes', 'No']
    },

    preferred_start_date: {
        type: Date
    },

    lesson_preference_time: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening']
    },

    preferred_contact_method: {
        type: String,
        enum: ['Phone call', 'WhatsApp', 'Email']
    },

    source: {
        type: String,
        enum: ['Google', 'Facebook', 'Instagram', 'Referral', 'Website', 'Other']
    },

    additional_message: {
        type: String
    },

    area_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'area'
    },

    duration: {
       type:String
    },

    price: {
      type:String
    },

    enquiry_status:{
        type:String,
        enum:['confirmed','not confirmed'],
        default:'confirmed'
    },
      instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstructorMaster'
    },

     seen: {
        type: Boolean,
        enum: [true, false],
        default: false
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
            'Lost',
            'Converted to Instructor'
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enquire', EnquireSchema);
