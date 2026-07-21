const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sl_no: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'admin', 'branch_manager', 'staff', 'student', 'instructor'], 
    default: 'student' 
  },   
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'school', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch', required: true },  	
  status: { type: Number, required: true },

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null }, 
  last_update_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
  deletedAt: { type: Date, default: null } // soft delete
}, { timestamps: true });

// Auto-increment sl_no
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastUser = await this.constructor.findOne().sort({ sl_no: -1 });
    this.sl_no = lastUser ? lastUser.sl_no + 1 : 1;
  }
  next();
});

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
