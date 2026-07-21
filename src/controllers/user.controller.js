const UserModel = require('../models/user.model');
const SchoolModel = require('../models/school.model'); // Import SchoolModel for validation
const bcrypt = require('bcryptjs');

// Get users based on auth role
exports.getAllUsers = async (req, res, next) => {
  try {
    // Fetch the complete auth user document to get school_id
    const authUser = await UserModel.findById(req.user._id);
    if (!authUser) {
        return res.status(401).json({ status: false, message: "Authentication failed: User not found." });
    }

    let filter = {
        deletedAt: null,
      };

    if (authUser.role != 'master') {
      // Exclude master & superadmin by default
      filter.role = { $nin: ['master','superadmin'] };
    }

    if (authUser.role === 'superadmin') {
      filter.role = { $ne: 'master' };
    }
    else if (authUser.role === 'admin') {
      // Filter users by the admin's school
      filter.school_id = authUser.school_id;
    }
    else if (authUser.role === 'branch_manager') {
      filter = {
        ...filter,
        branch_id: authUser.branch_id,
        role: { $nin: ['master', 'superadmin', 'admin'] }
      };
    }
    else if (authUser.role === "staff") {
      filter._id = authUser._id;
    }

    const users = await UserModel.find(filter).select('-password').populate("branch_id", "name").populate('school_id'); 
    res.status(200).json({
      status: true,
      data: users,
    });

  }
  catch(err){
		next(err);
	}
};

exports.createUser = async (req, res, next) => {
  try {
    // Fetch the complete auth user document to get school_id
    const authUser = await UserModel.findById(req.user._id);
    if (!authUser) {
        return res.status(401).json({ status: false, message: "Authentication failed: User not found." });
    }
    
    const { name, email, mobile, password, role, branch_id, school_id } = req.body;

    // validation
    if (!name || !email || !password || !role || !school_id || !branch_id) {
      return res.status(400).json({ status: false, message: "All required fields must be filled" });
    }

    // role restrictions
    if (['master','superadmin'].includes(role)) {
      return res.status(403).json({ status: false, message: "You cannot create master/superadmin users" });
    }

    // check email duplication
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: false, message: "Account already exists using this email id" });
    }

    const existingUserCheck = await UserModel.findOne({ mobile });
    if (existingUserCheck) {
      return res.status(409).json({ status: false, message: "Mobile number already exists" });
    }

    // Check if the school exists
    const school = await SchoolModel.findById(school_id);
    if (!school) {
        return res.status(404).json({ status: false, message: 'School not found.' });
    }

    // Admin can only create users within their own school
    if (authUser.role === 'admin' && authUser.school_id && authUser.school_id.toString() !== school_id) {
        return res.status(403).json({ status: false, message: 'You are not authorized to create users for this school.' });
    }
    
    // branch manager can only create users within their branch
    let assignedBranch = branch_id;
    let assignedSchool = school_id;
    if (authUser.role === 'branch_manager') {
      assignedBranch = authUser.branch_id; 
      assignedSchool = authUser.school_id;
    }


    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      school_id: assignedSchool,
      branch_id: assignedBranch,
      "status": 1,
      created_by: authUser._id,
      last_update_by: authUser._id,
    });

    await newUser.save();

    res.status(201).json({
      status: true,
      message: "User created successfully",
    });

  } catch (err) {
    next(err);
  }
};
// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const authUser = await UserModel.findById(req.user._id);
    if (!authUser) {
        return res.status(401).json({ status: false, message: "Authentication failed: User not found." });
    }

    const userId = req.params.id;
    const { name, email, mobile, role, branch_id, school_id } = req.body;

    const user = await UserModel.findById(userId);
    if (!user || user.deletedAt) {
      return res.status(404).json({ status: false, message: "User account not found" });
    }

    if (['master', 'superadmin'].includes(user.role) && authUser.role != 'master') {
      return res.status(403).json({ status: false, message: "You cannot update master/superadmin users" });
    }

    if (authUser.role === 'admin' && user.school_id && user.school_id.toString() !== authUser.school_id.toString()) {
        return res.status(403).json({ status: false, message: "Not authorized to update this user" });
    }

    if (authUser.role === 'branch_manager' && user.branch_id.toString() !== authUser.branch_id.toString()) {
      return res.status(403).json({ status: false, message: "Not authorized to update this user" });
    }

    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ status: false, message: "Email already exists" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (role) user.role = role;
    if (school_id) user.school_id = school_id;
    if (branch_id) user.branch_id = branch_id;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    user.last_update_by = authUser._id;

    await user.save();

    res.status(200).json({
      status: true,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
// Soft Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authUserId = req.user._id;

    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
    }
    
    user.deletedAt = new Date();
    user.last_update_by = authUserId;
    await user.save();

    return res.status(200).json({ status: true, message: "User account deleted successfully" });
  } catch (err) {
    next(err);
  }
};