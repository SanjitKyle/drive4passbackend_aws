
const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school',
        required: true
    },
    name: { type: String, required: true, maxLength: 255 },
    areacode: { type: String, required: true, maxLength: 10 },
    
   

    status: {
        type: String,
        enum: ['Active', 'Deactive'],
        required: [true, 'Status field is required.']
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    last_updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true   // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('area', AreaSchema);
