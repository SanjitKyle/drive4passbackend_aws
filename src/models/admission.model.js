const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
	institute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'lms_institute' },
	branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch' },
	student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },	
	course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },	
	roll_no: { type: Number },
	specialization: { type: String },
	session: { type: String, required: true },
	section: { type: String },

	fees_total: { type: Number, required: true  },
  	fees_paid: Number,

	admission_no: { type: String},
	admission_date: { type: Date, required: true },
	admission_source: { type: String},	
	
	status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
	created_by : { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	deletedAt: {type: Date, default: null} // for soft delete
},{ 
	timestamps: true  // adds createdAt and updatedAt automatically
});


AdmissionModel = mongoose.model('admission', AdmissionSchema);
module.exports = AdmissionModel;