const mongoose = require('mongoose');
const AdmissionModel = require('../models/admission.model');
const StudentModel = require("../models/student.model");


// Search Admissions by Date Range
exports.searchByDate = async (req, res, next) => {  
  try {
    const { from, to } = req.query;

    // Convert to ISO date objects
    const fromDate = new Date(from);
    const toDate   = new Date(to);

    const authUser = req.user;
    let filter = {         
      // deletedAt: null,
      branch_id: authUser.branchId,
      admission_date: {
        $gte: fromDate,
        $lte: toDate
      }        
    };

    const filtered = await AdmissionModel.find(filter)
    .sort({ createdAt: -1 })
    .populate('student_id', 'student_name dob')
    .populate('institute_id', 'institute_name')
    .populate('course_id', 'name')
    .populate('branch_id', 'name')
    .populate('created_by','name email');

    return res.status(200).json({
      status: true,
      message: 'Admissions fetched successfully',
      data: filtered
    });

  } catch (err) {
    next(err);
  }
};

// Get All Admissions
exports.getAdmissions = async (req, res, next) => {
  try {

    const authUser = req.user;
    const admissions = await AdmissionModel
      .find({ 
        deletedAt: null, 
        branch_id: authUser.branchId 
      })
      .sort({ createdAt: -1 })
      .populate('student_id', 'student_name dob')
      .populate('institute_id', 'institute_name')
      .populate('course_id', 'name')
      .populate('branch_id', 'name')
      .populate('created_by','name email');

    return res.status(200).json({
      status: true,
      message: 'Admissions fetched successfully',
      data: admissions
    });
  } catch (err) {
    next(err);
  }
};

// Get Admission By ID
exports.getAdmissionById = async (req, res, next) => {
  try {
    const admission = await AdmissionModel.findById(req.params.id)
      .populate('student_id')
      .populate('institute_id', 'institute_name')
      .populate('course_id', 'name')
      .populate('branch_id', 'name')
      .populate('created_by','name email');

    if (!admission) {
      return res.status(404).json({
        status: false,
        message: 'Admission not found'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Admission fetched successfully',
      data: admission
    });

  } catch (err) {
    next(err);
  }
};

// Create Admission
exports.createAdmission = async (req, res, next) => {
  try {
    const admission = await AdmissionModel.create(req.body);

    return res.status(201).json({
      status: true,
      message: 'Admission created successfully',
      data: admission
    });
  } catch (err) {
    next(err);
  }
};

// Update Admission
exports.updateAdmission = async (req, res, next) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const admissionId = req.params.id;

    // Fetch existing admission first
    const admissionData = await AdmissionModel.findById(admissionId).session(session);
    if (!admissionData) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ status: false, message: "Admission not found" });
    }

    const studentId = admissionData.student_id;

    // ----------------------------------------
    // Update Student Data
    // ----------------------------------------
    const studentUpdateData = {
      student_name: req.body.student_name,
      dob: req.body.dob,
      gender: req.body.gender,
      category: req.body.category,
      mobile: req.body.mobile,
      email: req.body.email,
      father_name: req.body.father_name,
      father_mobile_no: req.body.father_mobile_no,
      father_occupation: req.body.father_occupation,
      father_monthly_income: req.body.father_monthly_income,
      mother_name: req.body.mother_name,
      mother_mobile_no: req.body.mother_mobile_no,
      mother_occupation: req.body.mother_occupation,
      mother_monthly_income: req.body.mother_monthly_income,
      photo: req.body.photo,
      id_proof: req.body.id_proof,

      present_address: req.body.present_address,
      present_city: req.body.present_city,
      present_state: req.body.present_state,
      present_pincode: req.body.present_pincode,

      permanent_address: req.body.permanent_address,
      permanent_city: req.body.permanent_city,
      permanent_state: req.body.permanent_state,
      permanent_pincode: req.body.permanent_pincode,
    };

    const updatedStudent = await StudentModel.findByIdAndUpdate(
      studentId,
      studentUpdateData,
      { new: true, session }
    );

    // ----------------------------------------
    // Update Admission Data
    // ----------------------------------------
    const admissionUpdateData = {
      branch_id: req.body.branch_id,
      institute_id: req.body.institute_id,
      course_id: req.body.class_course,
      roll_no: req.body.roll_no,
      specialization: req.body.specialization,
      session: req.body.sessionValue,
      section: req.body.section,
      fees_total: req.body.fees_total,
      admission_no: req.body.admission_no,
      admission_date: req.body.admission_date,
      admission_source: req.body.admission_source,
    };

    const updatedAdmission = await AdmissionModel.findByIdAndUpdate(
      admissionId,
      admissionUpdateData,
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      status: true,
      message: "Admission & Student updated successfully",
      data: {
        student: updatedStudent,
        admission: updatedAdmission
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// Delete (Soft Delete) Admission
exports.deleteAdmission = async (req, res, next) => {
  try {
    const deleted = await AdmissionModel.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Admission not found'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Admission deleted successfully'
    });

  } catch (err) {
    next(err);
  }
};



// ===============================
// Get All Soft Deleted Admissions
// ===============================
exports.getDeletedAdmissions = async (req, res, next) => {
  try {
    const deleted = await AdmissionModel.find({
      deletedAt: { $ne: null }   // fetch only soft-deleted records
    })
      .sort({ deletedAt: -1 })   // latest deleted first      
      .populate('student_id', 'student_name dob')
      .populate('institute_id', 'institute_name')
      .populate('course_id', 'name')
      .populate('branch_id', 'name')
      .populate('created_by','name email');

    return res.status(200).json({
      status: true,
      message: "Soft deleted admissions fetched successfully",
      data: deleted
    });

  } catch (err) {
    next(err);
  }
};


// ======================
// Restore Deleted Admission
// ======================
exports.restoreAdmission = async (req, res, next) => {
  try {
    const restored = await AdmissionModel.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $ne: null } }, // only restore deleted records
      { deletedAt: null, status: "active" },            // restore and mark active again
      { new: true }
    );

    if (!restored) {
      return res.status(404).json({
        status: false,
        message: "Admission not found or not deleted"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Admission restored successfully",
      data: restored
    });

  } catch (err) {
    next(err);
  }
};


// ======================
// Permanent Delete Admission
// ======================
exports.permanentDeleteAdmission = async (req, res, next) => {
  try {
    const removed = await AdmissionModel.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        status: false,
        message: "Admission not found or already removed"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Admission permanently deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};
