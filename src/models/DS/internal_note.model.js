const mongoose = require('mongoose');

const InternalNoteSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'entityModel'
    },
    entityModel: {
        type: String,
        required: true,
        enum: ['Enquire', 'CourseForm', 'AdiTrainingForm', 'InstructorMaster', 'FranchiseEnquiry']
    },
    note: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Based on instructor_master.model.js using 'user' as ref
        required: false // Optional in case you want to allow anonymous/system notes, adjust if needed
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InternalNote', InternalNoteSchema);
