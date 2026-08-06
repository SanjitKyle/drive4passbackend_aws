
const InstructorMaster = require('../../models/DS/instructor_master.model');
const nodemailer = require("nodemailer");
const GeneratePassword = require('../../utils/GeneratePassword');
const SchoolModel = require('../../models/school.model');
const { SingUpMail, InstructorConfirmMail, InstructorUpdateProfileMail } = require('../../utils/MailSend');
const InstructorWorkingDay = require('../../models/DS/instructor_working_day.model')
const UserModel = require('../../models/user.model');
const bcrypt = require("bcryptjs");
const fs = require("fs");
const uploadToS3 = require('../../utils/s3_upload');
const { sendNotification } = require("./message_token_store");
const notificationToken = require("../../models/DS/fcmtokenstore");
const notificationStore = require("../../models/DS/notification_stored");
exports.createInstructor = async (data) => {
  try {
    // Create instructor
    const instructor = await InstructorMaster.create(data);
    console.log('instructor created ', instructor)

    if (!instructor) {
      throw new Error("Instructor creation failed");
    }

    // TODO: Send email notification here
    // await sendInstructorEmail(instructor);
    // await SingUpMail()

    return instructor; // return created object
  } catch (error) {
    throw error; // let controller handle it
  }
};
exports.getInstructors = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const instructors = await InstructorMaster.find({ school_id , deleted_at:null});
    console.log('instructors')
    if (!instructors) {
      return res.status(404).json({
        message: "Could not get instructors ",
        success: false
      })
    }
    return res.status(200).json({
      success: true,
      message: "all instructors data is below",
      data: instructors,
    });
  } catch (error) {
    next(error);
  }
};
exports.getInstructorById = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const instructor_id = req.params.id
    const instructor = await InstructorMaster.findOne({
      _id: req.params.id,
      school_id,
      deleted_at:null
    }).select('-password');

    const days = await InstructorWorkingDay.find({ school_id, instructor_id }).sort({ day_of_week: 1 });

    console.log('instructor find', instructor)

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: instructor,
      weekly: days
    });
  } catch (error) {
    next(error);
  }
};
exports.updateInstructor = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const updatedData = {};

    // Only update fields sent from frontend
    Object.keys(req.body).forEach((key) => {
      const val = req.body[key];
      // Ignore empty fields and Swagger UI dummy placeholder values
      if (
        val !== undefined &&
        val !== "" &&
        val !== "string" &&
        val !== 0 &&
        val !== "0" &&
        val !== "2026-07-16" &&
        !(Array.isArray(val) && val.length === 1 && val[0] === "string")
      ) {
        updatedData[key] = val;
      }
    });

    console.log("files", req.files);

    // PROFILE IMAGE
    if (req.files?.profile?.length > 0) {
      const file = req.files.profile[0];
      const secureUrl = await uploadToS3(file.path, "instructors/profile", file.mimetype);

      updatedData.profile = secureUrl;
      fs.unlinkSync(file.path);
    }

    // LICENCE COPY
    if (req.files?.upload_licence_copy?.length > 0) {
      const file = req.files.upload_licence_copy[0];
      const secureUrl = await uploadToS3(file.path, "instructors/licence", file.mimetype);

      updatedData.upload_licence_copy = secureUrl;
      fs.unlinkSync(file.path);
    }

    const updated = await InstructorMaster.findOneAndUpdate(
      { _id: req.params.id, school_id },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found or unauthorized",
      });
    }

    // Sync important fields with UserModel (Auth)
    if (updated.instructor_user_id && (updatedData.password || updatedData.email || updatedData.name || updatedData.mobile)) {
      const instructorUser = await UserModel.findById(updated.instructor_user_id);
      
      if (instructorUser) {
        if (updatedData.name) instructorUser.name = updatedData.name;
        if (updatedData.email) instructorUser.email = updatedData.email;
        if (updatedData.mobile) instructorUser.mobile = updatedData.mobile;
        
        if (updatedData.password) {
          const hashedPassword = await bcrypt.hash(updatedData.password, 10);
          instructorUser.password = hashedPassword;
        }

        await instructorUser.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Instructor updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteInstructor = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const deleted = await InstructorMaster.findByIdAndUpdate({
      _id: req.params.id,
      school_id,
    }, {
      $set: {
        deleted_at: new Date(),
        deleted_by: req.user._id
      }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
exports.confirmInstructor = async (req, res) => {
  try {
    const approvedBy = req.user._id;
    const instructorId = req.params.id;

    if (!instructorId) {
      return res.status(400).json({
        message: "Provide instructor id",
        success: false,
      });
    }

    const instructor = await InstructorMaster.findById(instructorId)
      .select("+password")
      .populate("school_id");

    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found",
        success: false,
      });
    }

    const businessName = instructor.school_id.school_name ?? "Drive4pass";

    // Ensure a password exists before proceeding
    let passwordToUse = instructor.password;
    if (!passwordToUse) {
      passwordToUse = GeneratePassword();
      await InstructorMaster.findByIdAndUpdate(instructorId, { password: passwordToUse });
    }

    // Approve instructor
    await InstructorMaster.findByIdAndUpdate(
      instructorId,
      { approved_by: approvedBy, status: 1 },
      { new: true }
    );

    // Check if instructor user already exists
    let instructorUser = await UserModel.findOne({
      email: instructor.email,
      role: "instructor",
    });

    const hashedPassword = await bcrypt.hash(passwordToUse, 10);

    // Create user if not exists
    if (!instructorUser) {
      instructorUser = new UserModel({
        name: instructor.name,
        email: instructor.email,
        mobile: instructor.mobile,
        password: hashedPassword,
        role: "instructor",
        school_id: instructor.school_id._id,
        branch_id: instructor.branch_id,
        status: 1,
      });

      await instructorUser.save();
    }

    // Link user model to instructor
    await InstructorMaster.findByIdAndUpdate(
      instructorId,
      { instructor_user_id: instructorUser._id },
      { new: true }
    );


    await InstructorConfirmMail(
      businessName,
      instructor.email,
      passwordToUse, // Send the plain-text password to the user
      instructor.name
    );

    return res.status(200).json({
      message: "Instructor approved successfully",
      success: true,
    });
  } catch (error) {
    console.error("Confirm Instructor Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.notifyInstructorCredentials = async (req, res, next) => {
  try {
    const instructorId = req.params.id;
    const school_id = req.user.school_id;

    // Fetch instructor with password included
    const instructor = await InstructorMaster.findOne({ _id: instructorId, school_id }).select("+password");

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    if (!instructor.email || !instructor.password) {
      return res.status(400).json({
        success: false,
        message: "Instructor does not have an email or password configured",
      });
    }

    const school = await SchoolModel.findById(school_id);
    const businessName =  "Drive4pass";

    await InstructorUpdateProfileMail(businessName, instructor.email, instructor.password, instructor.name);

    // Push notification logic
    const created_by = req.user._id;
    const notificationMessage = `Your login credentials have been updated by the administrator.`;
    
    // Find device token
    const userToken = await notificationToken.findOne({ user: instructorId });
    if (userToken && userToken.token) {
      await sendNotification({
        token: userToken.token,
        title: "Profile Updated",
        body: notificationMessage,
        data: { type: "profile_update" }
      });
    }
    
    // Store notification in database
    await notificationStore.create({
      message: notificationMessage,
      receiver_id: instructorId,
      sender_id: created_by,
      route: "/profile"
    });

    return res.status(200).json({
      success: true,
      message: "Credentials notification sent successfully",
    });
  } catch (error) {
    next(error);
  }
};
