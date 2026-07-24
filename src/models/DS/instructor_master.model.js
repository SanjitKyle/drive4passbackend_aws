const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const InstructorMasterSchema = new mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
    },
    profile: {
      type: String,
    },
    instructor_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    password: {
      type: String,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "area",
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    instructor_bio: {
      type: String,
      trim: true,
    },
    full_address: {
      type: String,
      trim: true,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0, // 1 = active, 0 = inactive
    },
    
    // --- DRIVING & QUALIFICATIONS ---
    driving_lichence_number: {
      type: String,
    },
    licence_expiry_date: {
      type: Date,
    },
    badge_number: { // Renamed from pdi_badge_number
      type: String,
    },
    badge_expiry_date: {
      type: Date,
    },
    experience: {
      type: Number,
    },
    driving_experience: {
      type: Number,
    },
    service_provided_area: [{
      type: String
    }],
    transmission_type: {
      type: String,
      enum: ["Manual", "Automatic", "Both", ""],
      default: "Both",
    },
    
    // --- NEW FRANCHISE & WORK FIELDS ---
    work_type: {
      type: String,
      enum: ["Full-time", "Part-time", ""],
      default: "",
    },
    type: { // ADI or PDI
      type: String,
      enum: ["ADI", "PDI", ""],
      default: "",
    },
    start_date: {
      type: Date,
    },
    franchise_start_date: {
      type: Date,
    },

    // --- NEW VEHICLE DETAILS FIELDS ---
    car_make: {
      type: String,
      trim: true,
    },
    car_model: {
      type: String,
      trim: true,
    },
    car_reg: {
      type: String,
      trim: true,
    },

    contract_signed: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No'
    },
    upload_licence_copy: {
      type: String,
    },
    
    // --- AUDIT & DELETION ---
    deleted_at: {
      type: Date,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InstructorMaster", InstructorMasterSchema);
