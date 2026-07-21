const UserModel = require("../models/user.model");
const StudentModel = require("../models/student.model"); // Import StudentModel
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userToken = require("../models/UserToken.Model");
const GenerateToken = require("../utils/GenerateToken");
const { SingUpMail } = require("../utils/MailSend");
const { createInstructor } = require("./DS/instructor_master.controller");
const InstructorMaster = require("../models/DS/instructor_master.model");
const uploadToS3 = require("../utils/s3_upload");
const fs = require("fs");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await UserModel.findOne({ email }).populate("school_id");
    // console.log("email", email, "and passwrod", password)
    if (
      !userData ||
      userData.role === "student" ||
      userData.role === "instructor"
    )
      return res.json({
        status: false,
        message: "Invalid email or password",
      });
    // Check Password
    const isMatch = await bcrypt.compare(password, userData.password);
    // console.log('ismatch', isMatch)
    if (!isMatch)
      return res.json({
        status: false,
        message: "Login failed. Please check your credentials.",
      });

    const { token, expireDate } = await GenerateToken(userData);

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Could not create token",
      });
    }
    const tokenStored = await userToken.create({
      userId: userData._id,
      token,
      isActive: true,
      loginAt: new Date(),
      expireAt: expireDate,
    });

    if (!tokenStored) {
      return res.status(403).json({
        message: "Could not store token in database",
        success: false,
        error: tokenStored,
      });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      status: true,
      message: "Login Success",
      access_token: token,
      user: userData,
      tokenstore: tokenStored,
    });
  } catch (err) {
    next(err);
  }
};

exports.studentSignup = async (req, res, next) => {
  try {
    const { name, email, mobile, password, school_id, branch_id } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const newStudent = new UserModel({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "student",
      school_id,
      branch_id,
      status: 1, // Active by default
    });

    await newStudent.save();

    res
      .status(201)
      .json({ status: true, message: "Student registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.studentLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email, role: "student" });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status !== 1) {
      return res.status(401).json({
        success: false,
        message: "Your account is not active. Please contact support.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { token } = await GenerateToken(user);
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Could not create token",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    const userData = user.toObject();
    delete userData.password;

    const studentData = await StudentModel.findOne({
      student_user_id: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Student login successful",
      access_token: token,
      userData: userData,
      studentData: studentData || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.instructorSingup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      school_id,
      branch_id,
      instructor_bio,
      full_address,
      driving_lichence_number,
      licence_expiry_date,
      badge_number,
      badge_expiry_date,
      experience,
      driving_experience,
      service_provided_area,
      transmission_type,
      work_type,
      type,
      start_date,
      franchise_start_date,
      car_make,
      car_model,
      car_reg,
      contract_signed
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Licence copy is required",
      });
    }

    // 1️⃣ Upload to S3
    const upload_licence_copy = await uploadToS3(req.file.path, "instructors/licence", req.file.mimetype);

    // 2️⃣ Remove local file
    fs.unlinkSync(req.file.path);

    // 3️⃣ Validations
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already in use",
      });
    }

    const isMobileExist = await UserModel.findOne({ mobile });
    if (isMobileExist) {
      return res.status(403).json({
        status: false,
        message: "Mobile number already exists",
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Save instructor
    const instructorCreate = await createInstructor({
      name,
      email,
      mobile,
      school_id,
      branch_id,
      instructor_bio,
      full_address,
      password: password,
      instructor_user_model_id: null,
      driving_lichence_number,
      licence_expiry_date,
      badge_number,
      badge_expiry_date,
      experience,
      driving_experience,
      service_provided_area,
      transmission_type,
      work_type,
      type,
      start_date,
      franchise_start_date,
      car_make,
      car_model,
      car_reg,
      upload_licence_copy,
      contract_signed
    });

    if (instructorCreate) {
      await SingUpMail("Drive4pass", email, "******", name);
    }

    res.status(201).json({
      status: true,
      message: "Instructor registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.instructorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log('calling');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 1. Find userData
    const userData = await UserModel.findOne({ email });
    // console.log('userData',userData)

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Generate token
    const { token } = await GenerateToken(userData);
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Could not create token",
      });
    }

    // 4. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    // 5. Remove password
    const instUserData = userData.toObject();
    delete instUserData.password;

    // 6. Find instructor data
    const instructorData = await InstructorMaster.findOne({
      instructor_user_model_id: userData._id,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Instructor login successful",
      access_token: token,
      user: instUserData,
      instructor_data: instructorData,
    });
  } catch (error) {
    next(error);
  }
};

exports.validateToken = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.json({ message: "User ID Not Found" });
    const userData = await UserModel.findById(userId).populate(
      "branch_id",
      "name",
    );
    res.json({ status: true, message: "Token validated.", user: userData });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id; // logged in user
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.json({
        status: false,
        message: "Old password and new password are required",
      });
    }

    // Validate new password length
    if (new_password.length < 6) {
      return res.json({
        status: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Fetch user
    const user = await UserModel.findById(userId);
    if (!user || user.deletedAt) {
      return res.json({
        status: false,
        message: "Unable to validate your account",
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.json({
        status: false,
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;
    user.last_update_by = userId;

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { token_id } = req.body;
    if (!token_id) {
      return res.status(404).json({
        message: "Please provide token Id",
        success: false,
      });
    }
    const updated = await userToken.findOneAndUpdate(
      { _id: token_id, userId: userId },
      { expireAt: Date.now(), isActive: false, logoutAt: Date.now() },
      { new: true },
    );
    if (!updated) {
      return res.status(403).json({
        message: "Could not update token ",
        success: true,
      });
    }
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    return res.status(201).json({
      message: "Logout Successfully ",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
