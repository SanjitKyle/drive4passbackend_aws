const mongoose = require("mongoose");
const LeadModel = require("../../models/LMS/lead.model");
const LeadTaggingModel = require("../../models/LMS/lead_tagging.model");
const LeadSourceModel = require("../../models/LMS/leadsource.model");
const LeadStatusModel = require("../../models/LMS/leadstatus.model");
const CourseModel = require("../../models/course.model");
const UserModel = require('../../models/user.model');


// 🕓 Normalize dates for full UTC day range
const parseDateToUTC = (dateStr, isEnd = false) => {
  let d = new Date(dateStr);
  if (isNaN(d)) {
    // Try fallback for YYYY-MM-DD format (no timezone)
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [y, m, day] = parts;
      d = new Date(Date.UTC(+y, +m - 1, +day, isEnd ? 23 : 0, isEnd ? 59 : 0, isEnd ? 59 : 0, isEnd ? 999 : 0));
    } else {
      throw new Error("Invalid date format");
    }
  } else {
    // Normalize to full-day UTC range
    if (isEnd) d.setUTCHours(23, 59, 59, 999);
    else d.setUTCHours(0, 0, 0, 0);
  }
  return d;
};



// Search leads based on update leds
exports.searchDashboardLeads = async (req, res, next) => {
  try {
    const { from_date, to_date, assigned_user_id } = req.body;

    if (!from_date || !to_date) {
      return res.json({
        status: false,
        message: "from_date and to_date are required",
      });
    }

    const start = parseDateToUTC(from_date, false);
    const end = parseDateToUTC(to_date, true);

    const matchQuery = {
      deletedAt: null,
      // updatedAt: { $gte: start, $lte: end },
    };

    const authUser = req.user;

    if (authUser.role === "staff") {
      matchQuery.asigned_user = authUser._id;
    }
    else if (authUser.role === 'branch_manager') {
      matchQuery.branch_id = authUser.branchId;
    }
    else if (authUser.role === 'superadmin') {
      
    }

    if (assigned_user_id) {
      matchQuery.asigned_user = assigned_user_id;
    }

    // Fetch leads with populate
    let leads = await LeadModel.find(matchQuery)
      .populate("course_id", "name")
      .populate("lead_source_id", "name")
      .populate("lead_status_id", "status_name")
      .populate("lead_type_id", "type_name")
      .populate("institute_id", "institute_name")
      .populate("asigned_user", "name email")
      .populate("last_update_by", "name email")
      .populate("created_by", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Attach last tagging date to each lead
    // for (let lead of leads) {
    //   const lastTagging = await LeadTaggingModel.findOne({ lead_id: lead._id })
    //     .sort({ createdAt: -1 })
    //     .lean();

    //   lead.followup_date = lastTagging ? lastTagging.followup_date : null;
    //   lead.last_followup_date = lastTagging ? lastTagging.updatedAt : null;
    //   lead.remarks = lastTagging ? lastTagging.remarks : null;
    // }

    return res.status(200).json({
      status: true,
      message: "Leads fetched successfully",
      data: leads,
      createdAt: {
        $gte: new Date(from_date),
        $lte: new Date(to_date),
      },
      request: req.body
    });
  } catch (error) {
    next(error);
  }
};

// Search leads based on entry leds
exports.searchLeads = async (req, res, next) => {
  try {
    const { from_date, to_date, assigned_user_id } = req.body;

    if (!from_date || !to_date) {
      return res.json({
        status: false,
        message: "from_date and to_date are required",
      });
    }

    const start = parseDateToUTC(from_date, false);
    const end = parseDateToUTC(to_date, true);

    const matchQuery = {
      deletedAt: null,
      lead_gen_date: { $gte: start, $lte: end },
    };

    if (assigned_user_id) {
      matchQuery.asigned_user = assigned_user_id;
    }

    const authUser = req.user;

    if (authUser.role === "staff") {
      matchQuery.asigned_user = authUser._id;
    }
    else if (authUser.role === 'branch_manager') {
      matchQuery.branch_id = authUser.branchId;
    }
    else if (authUser.role === 'superadmin') {
      
    }


    // Fetch leads with populate
    let leads = await LeadModel.find(matchQuery)
      .populate("course_id", "name")
      .populate("lead_source_id", "name")
      .populate("lead_status_id", "status_name")
      .populate("lead_type_id", "type_name")
      .populate("institute_id", "institute_name")
      .populate("asigned_user", "name email")
      .populate("last_update_by", "name email")
      .populate("created_by", "name email")
      .sort({ createdAt: -1 })
      .lean();


    // Attach last tagging date to each lead
    // for (let lead of leads) {
    //   const lastTagging = await LeadTaggingModel.findOne({ lead_id: lead._id })
    //     .sort({ createdAt: -1 })
    //     .lean();

    //   lead.followup_date = lastTagging ? lastTagging.followup_date : null;
    //   lead.last_followup_date = lastTagging ? lastTagging.updatedAt : null;
    //   lead.remarks = lastTagging ? lastTagging.remarks : null;
    // }

    return res.status(200).json({
      status: true,
      message: "Leads fetched successfully",
      count: leads.length,
      data: leads,
      createdAt: {
        $gte: new Date(from_date),
        $lte: new Date(to_date),
      },
      request: req.body
    });
  } catch (error) {
    next(error);
  }
};

// Get All Leads
exports.getLeads = async (req, res, next) => {
  try {
    const leads = await LeadModel.find({
        deletedAt: null,
      })
      .populate("course_id", "name")
      .populate("lead_source_id", "name")
      .populate("lead_status_id", "status_name")
      .populate("lead_type_id", "type_name")
      .populate("institute_id", "institute_name")
      .populate("asigned_user", "name email")
      .populate("last_update_by", "name email")
      .populate("created_by", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Lead
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await LeadModel.findById(req.params.id)
      .populate("course_id", "name")
      .populate("lead_source_id", "name")
      .populate("lead_status_id", "status_name")
      .populate("lead_type_id", "type_name")
      .populate("institute_id", "institute_name")
      .populate("asigned_user", "name email")
      .populate("last_update_by", "name email")
      .populate("created_by", "name email");
      
    if (!lead) {
      return res.status(404).json({
        status: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Lead fetched successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Create Lead with Transaction
exports.createLead = async (req, res, next) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  const authUser = req.user;

  try {
    const leadData = {
      ...req.body,
      asigned_user: req.user._id,
      last_update_by: req.user._id,
      created_by: req.user._id,
      lead_gen_date: new Date(),
      branch_id: authUser.branchId,
    };

    const joinFields = [
      "course_id",
      "lead_source_id",
      "lead_status_id",
      "lead_type_id",
      "institute_id",
      "asigned_user",
    ];

    joinFields.forEach((field) => {
      if (leadData[field] === "") {
        leadData[field] = null;
      }
    });

    const lead = await LeadModel.create(leadData);
    // const lead = new Lead(leadData);
    // await lead.save({ session });

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({
      status: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    next(error);
  }
};

// Update Lead
exports.updateLead = async (req, res, next) => {
  try {
    const lead = await LeadModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, last_update_by: req.user._id },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        status: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Lead
exports.deleteLead = async (req, res, next) => {
  try {

    const deleted = await LeadModel.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Bulk Upload Leads
exports.bulkUploadLeads = async (req, res, next) => {
  try {
    const leadsData = req.body.leadsData;

    if (!Array.isArray(leadsData) || leadsData.length === 0) {
      return res.json({
        status: false,
        message: "Invalid input. Expected an data from csv file of leads",
      });
    }

    const createdLeads = [];
    const skippedLeads = [];

    for (let lead of leadsData) {

      let mobile = (lead.mobile || "").replace(/\D/g, ""); // keep only digits

      if (mobile.length > 10) {
        mobile = mobile.slice(-10);
      }

      // ✅ Validate mobile number (10 digits, numeric only)
      if (!/^\d{10}$/.test(mobile)) {
        skippedLeads.push({ lead, reason: "Invalid mobile number" });
        continue;
      }

      // ✅ Check if lead already exists by mobile
      const existingLead = await LeadModel.findOne({ mobile: mobile });
      if (existingLead) {
        skippedLeads.push({ lead, reason: "Duplicate mobile number" });
        continue;
      }

      // find course by name_of_the_course
      let course = await CourseModel.findOne({
        name: { $regex: new RegExp("^" + lead.name_of_the_course + "$", "i") },
      });

      // find lead source by lead_source name
      let leadSource = await LeadSourceModel.findOne({
        name: { $regex: new RegExp("^" + lead.lead_source + "$", "i") },
      });

      // 🔹 check if assigned_user is provided
      let assignedUserId = null;
      let branch_id = null;
      if (lead.asigned_user) {
        const user = await UserModel.findOne({ sl_no: lead.asigned_user });
        assignedUserId = user ? user._id : null;
        assignedUserId = user ? user._id : null;
        branch_id = user ? user.branch_id : '686f593483192496dcf5fe2c';
      }

      const newLead = new LeadModel({
        lead_gen_date: lead.lead_gen_date ? new Date(lead.lead_gen_date) : new Date(),
        contact_person: lead.contact_person,
        mobile: mobile,
        address: lead.address,
        email: lead.email || null,
        course_id: course ? course._id : null,
        lead_source_id: leadSource ? leadSource._id : null,
        asigned_user: assignedUserId,
        branch_id: branch_id,
        created_by: req.user._id, // Auth user
        last_update_by: req.user._id, // Auth user
      });

      await newLead.save();
      createdLeads.push(newLead);
    }

    return res.status(201).json({
      status: true,
      message: "Bulk leads uploaded successfully",
      data: createdLeads,
      created_count: createdLeads.length,
      skipped_count: skippedLeads.length,
      createdLeads,
      skippedLeads,
    });
  } catch (error) {
    next(error);
  }
};

// Push lead from old software Upload Leads
exports.pushLeads = async (req, res, next) => {
  try {
    const leadsData = req.body.leadsData;

    if (!Array.isArray(leadsData) || leadsData.length === 0) {
      return res.json({
        status: false,
        message: "Invalid input. Expected an data from csv file of leads",
      });
    }

    const createdLeads = [];
    const skippedLeads = [];

    for (let lead of leadsData) {

      let existingLead = await LeadModel.findOne({ mobile: lead.mobile });

      // if (existingLead) {
      //   skippedLeads.push({
      //     mobile: lead.mobile,
      //     message: "Duplicate mobile number. Lead skipped.",
      //   });
      //   continue;
      // }

      // find course by course_name
      let course = await CourseModel.findOne({
        name: { $regex: new RegExp("^" + lead.course_name + "$", "i") },
      });

      // find lead source by lead_source name
      let leadSource = await LeadSourceModel.findOne({
        name: { $regex: new RegExp("^" + lead.source_name + "$", "i") },
      });

      // find lead status by status_name
      let leadStatus = await LeadStatusModel.findOne({
        status_name: { $regex: new RegExp("^" + lead.status_name + "$", "i") },
      });

      // 🔹 check if assigned_user is provided
      let assignedUserId = null;
      if (lead.telecaller_id) {
        const user = await UserModel.findOne({ sl_no: lead.telecaller_id });
        assignedUserId = user ? user._id : null;
      }

      const newLead = new LeadModel({
        lead_gen_date: lead.lead_gen_date ? new Date(lead.lead_gen_date) : new Date(),
        contact_person: lead.contact_person,
        mobile: lead.mobile,
        address: lead.address,
        email: lead.email || null,
        course_id: course ? course._id : null,
        lead_status_id: leadStatus ? leadStatus._id : null,
        lead_source_id: leadSource ? leadSource._id : null,
        lead_type_id: '68a739c0f0216d8e460c6334',
        institute_id: '68bbd47617030f7937150f24',
        asigned_user: assignedUserId,
        created_by: '68cc0a7bbdd0cf0efb094c47',
        last_update_by: '68cc0a7bbdd0cf0efb094c47',
        status: lead.status,
        followup_date: lead.flow_up_date ? new Date(lead.flow_up_date) : new Date(),
        createdAt: lead.lead_gen_date ? new Date(lead.lead_gen_date) : new Date(),
      });

      let leadData = await newLead.save();
      if(leadData){
        let lead_id = leadData._id;

        for (let tagging of lead.lead_taggings){

          // find lead status by status_name
          let taggingLeadStatus = await LeadStatusModel.findOne({
            status_name: { $regex: new RegExp("^" + tagging.tagging_status.status_name + "$", "i") },
          });

          // find updated by user id
          let user = await UserModel.findOne({ sl_no: tagging.updated_by });

          let leadTaggingData = new LeadTaggingModel({
            lead_id,
            lead_status_id: taggingLeadStatus ? taggingLeadStatus._id : null,
            next_flowup_date: tagging.next_flowup_date,
            remarks: tagging.remark,
            updated_by: user ? user._id : null,
            createdAt: tagging.updated_date,
            // updatedAt: tagging.updated_date,
          });
          await leadTaggingData.save();
        }
      }
      createdLeads.push(newLead);
    }

    return res.status(201).json({
      status: true,
      message: "Bulk leads uploaded successfully",
      data: createdLeads,
      created_count: createdLeads.length,
      skipped_count: skippedLeads.length,
      createdLeads,
      skippedLeads,
    });
  } catch (error) {
    next(error);
  }
};