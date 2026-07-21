const mongoose = require('mongoose');

const LeadStatusSchema = new mongoose.Schema({
    status_name: { type: String, required: true, trim: true, unique: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    deletedAt: { type: Date, default: null } // soft delete
}, {
    timestamps: true,
    collection: 'lms_lead_status'  // collection name as required
});

module.exports = mongoose.model('lms_lead_status', LeadStatusSchema);
