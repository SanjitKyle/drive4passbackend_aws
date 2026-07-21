const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
	sl_no: {
			type: Number, 
			required: [true, 'Serial number field is required.']
	},
	school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'school' },
	branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch' },	
	student_name: { type: String, required: true },
	dob: { type: Date, required: true },
	gender: { type: String, required: true },
	category: { type: String},
	mobile: { type: String, required: true },
	email: { 
			type: String, 
			required: [false, 'Please enter a valid email address.' ],
			match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.']
		},	
	father_name: { type: String, required: false },
	father_mobile_no: { type: String },
	father_occupation: { type: String },
	father_monthly_income: { type: Number },
	mother_name: { type: String, required: false },	
	mother_mobile_no: { type: String },
	mother_occupation: { type: String },
	mother_monthly_income: { type: Number },
	photo: { type: String },
	id_proof: { type: String },

	present_address: { type: String, required: true },
	present_city: { type: String, required: true },
	present_state: { type: String, required: true },
	present_pincode: { type: String, required: true },

	permanent_address: { type: String, required: true },
	permanent_city: { type: String, required: true },
	permanent_state: { type: String, required: true },
	permanent_pincode: { type: String, required: true },

	status: { type: String, enum: ['active', 'passout'], default: 'active' },
	created_by : { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	deletedAt: {type: Date, default: null},
    student_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    }
},{ 
	timestamps: true
});

const StudentModel = mongoose.model('student', StudentSchema);
module.exports = StudentModel;