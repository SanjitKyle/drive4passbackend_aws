
const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    school_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'school',
        required: true
    },
	name: { type: String, required: true, maxLength: 255 },
	code: { type: String, required: true, unique: [true, 'Branch code already exists'], maxLength: 10 },
	address: { type: String, required: true, maxLength: 255 },
	contact_email: { 
				type: String,
				required: true,
				lowercase: true,
				trim: true, 				
				match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.'] 
			},
	phone: { type: String, required: true, maxLength: 20, minLength: [10, 'Please enter a valid mobile number'] },
    branch_currency: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    branch_timezones: { type: String, required: true },
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

module.exports = mongoose.model('branch', BranchSchema);
