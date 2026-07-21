const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    school_name: {
        type: String,
        required: true
    },
    owner_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address_line_1: {
        type: String,
        required: true
    },
    address_line_2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zip_code: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    currency_symbol: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    last_updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const SchoolModel = mongoose.model('school', schoolSchema);

module.exports = SchoolModel;
