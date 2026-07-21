const mongoose = require('mongoose');
const StudentModel = require('../models/student.model');
const AdmissionModel = require('../models/admission.model');
const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.createStudent = async (req, res, next) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      branch_id, student_name, dob, gender, category, mobile, email,
      father_name, father_mobile_no, father_occupation, father_monthly_income,
      mother_name, mother_mobile_no, mother_occupation, mother_monthly_income,
      photo, id_proof,

      // Admission-specific fields
      roll_no,
      admission_no, admission_date, admission_source,
      institute_id,
      class_course, specialization, session: sessionValue, section,
      fees_total,

      //Address
      present_address, present_city, present_state, present_pincode,
      permanent_address, permanent_city, permanent_state, permanent_pincode,
    } = req.body;

    const authUser = req.user;

    // Step 1: Get latest sl_no within the session
    const lastStudent = await StudentModel
      .findOne({})
      .sort({ sl_no: -1 })
      .session(session);

    const new_sl_no = lastStudent ? lastStudent.sl_no + 1 : 1;

    // Step 2: Create student
    const newStudent = new StudentModel({
      sl_no: new_sl_no,
      branch_id,
      school_id: authUser.school_id, // Get school_id from authenticated user
      student_name, dob, gender, category, mobile, email,
      father_name, father_mobile_no, father_occupation, father_monthly_income,
      mother_name, mother_mobile_no, mother_occupation, mother_monthly_income,
      photo, id_proof,
      present_address, present_city, present_state, present_pincode,
      permanent_address, permanent_city, permanent_state, permanent_pincode,
      status: 'active',
      created_by: authUser._id
    });

    const savedStudent = await newStudent.save({ session });

    // Step 3: Create admission
    const newAdmission = new AdmissionModel({
      branch_id,
      student_id: savedStudent._id,
      institute_id,
      course_id: class_course,
      roll_no,
      specialization,
      session: sessionValue,
      section,
      fees_total,
      fees_paid: 0,
      admission_no,
      admission_date,
      admission_source,
      status: 'active',
      created_by: authUser._id
    });

    const savedAdmission = await newAdmission.save({ session });

    // Step 4: Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'Student and Admission created successfully',
      data: {
        student: savedStudent,
        admission: savedAdmission
      }
    });

  } catch (err) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.getAllStudents = async (req, res, next) => {
  try {
    const authUser = req.user;
    let filter = {
      deletedAt: null,
      branch_id: authUser.branchId
    };
    let students = await StudentModel.find(filter);
    res.status(200).json({ status: true, message: 'Students fetched successfully', students: students });
  }
  catch (err) {
    next(err);
  }
}

exports.getStudentById = async (req, res, next) => {
  try {
    let student = await StudentModel.findOne(req.body.id);
    if (!student) return res.status(400).json({ status: false, message: 'Student not found.' });
    res.status(200).json({ status: true, message: 'Student fetched successfully', student });
  }
  catch (err) {
    next(err);
  }
}

exports.updateStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    // Find the student by the provided ID
    let student = await StudentModel.findById(studentId);

    if (student) {
      // If the student exists, update their data
      const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, updateData, { new: true, runValidators: true });
      res.status(200).json({ status: true, message: 'Student profile updated successfully', student: updatedStudent });
    } else {
      // If the student does not exist, create a new one
      const lastStudent = await StudentModel.findOne({}).sort({ sl_no: -1 });
      const new_sl_no = lastStudent ? lastStudent.sl_no + 1 : 1;

      const newStudentData = {
        ...updateData,
        sl_no: new_sl_no,
        created_by: req.user ? req.user._id : null
      };

      const newStudent = new StudentModel(newStudentData);
      const savedStudent = await newStudent.save(); // Mongoose validation will run here

      res.status(201).json({ status: true, message: 'New student created successfully', student: savedStudent });
    }
  } catch (err) {
    next(err);
  }
};

exports.getLoginDetails = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({
        status: false,
        message: "Student ID is required."
      });
    }

    const student = await StudentModel.findById(student_id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found."
      });
    }

    if (!student.student_user_id) {
      return res.status(200).json({
        status: true,
        message: "Login not enabled for this student.",
        data: null
      });
    }

    const user = await UserModel.findById(student.student_user_id).select('-password');

    if (!user) {
      return res.status(200).json({
        status: true,
        message: "Associated user not found.",
        data: null
      });
    }

    res.status(200).json({
      status: true,
      message: "Login details fetched successfully.",
      data: user
    });

  } catch (err) {
    next(err);
  }
};

exports.enableStudentLogin = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({
        status: false,
        message: "Student ID is required."
      });
    }

    const student = await StudentModel.findById(student_id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found."
      });
    }

    if (!student.email) {
      return res.status(400).json({
        status: false,
        message: "Student must have an email address to enable login."
      });
    }

    if (!student.mobile) {
      return res.status(400).json({
        status: false,
        message: "Student must have a mobile number to enable login."
      });
    }

    let targetUser = null;

    if (student.student_user_id) {
      targetUser = await UserModel.findById(student.student_user_id);
    }

    if (!targetUser) {
      targetUser = await UserModel.findOne({ email: student.email });
    }

    if (targetUser) {
      // Update existing user status
      targetUser.status = 1;
      await targetUser.save();

      // Ensure student has the reference
      if (student.student_user_id?.toString() !== targetUser._id.toString()) {
        student.student_user_id = targetUser._id;
        await student.save();
      }

      return res.status(200).json({
        status: true,
        message: "Student login enabled successfully.",
        user: targetUser
      });
    }

    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = new UserModel({
      name: student.student_name,
      email: student.email,
      mobile: student.mobile,
      password: hashedPassword,
      role: 'student',
      school_id: student.school_id,
      branch_id: student.branch_id,
      status: 1,
    });

    const savedUser = await newUser.save();

    student.student_user_id = savedUser._id;
    await student.save();

    res.status(200).json({
      status: true,
      message: "Student login enabled successfully.",
      user: savedUser
    });

  } catch (err) {
    next(err);
  }
};

exports.disableStudentLogin = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({
        status: false,
        message: "Student ID is required."
      });
    }

    const student = await StudentModel.findById(student_id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found."
      });
    }

    if (!student.student_user_id) {
      return res.status(400).json({
        status: false,
        message: "Student login is not enabled."
      });
    }

    const user = await UserModel.findById(student.student_user_id);

    if (!user) {
      student.student_user_id = null;
      await student.save();
      return res.status(404).json({
        status: false,
        message: "Associated user not found, but student record has been corrected."
      });
    }

    user.status = 0;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Student login disabled successfully."
    });

  } catch (err) {
    next(err);
  }
};

exports.getStudentProfile = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({
        status: false,
        message: "Student ID is required."
      });
    }

    const student = await StudentModel.findById(student_id);

    if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found."
      });
    }

    const admission = await AdmissionModel.findOne({ student_id: student_id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Student profile fetched successfully.",
      data: {
        student: student,
        admission: admission
      }
    });

  } catch (err) {
    next(err);
  }
};