// controllers/LMS/lead_tagging.controller.js
const LeadTaggingModel = require("../../models/LMS/lead_tagging.model");
const LeadModel = require("../../models/LMS/lead.model");

// Create Lead Tagging
exports.createLeadTagging = async (req, res, next) => {
  try {

    const { lead_id } = req.params;
    if (!lead_id) {
        return res.status(400).json({
          status: false,
          message: "lead_id is required"
        });
      }

    const { lead_status_id, followup_date, status, remarks } = req.body;

    const leadTagging = new LeadTaggingModel({
      lead_id,
      lead_status_id,
      next_flowup_date: followup_date,
      remarks,
      updated_by: req.user._id, // Auth User ID
    });

    await leadTagging.save();

    // ✅ Update lead collection status if lead_stage == 0
    let updateField = {
      lead_status_id,
      followup_date
    };
    
    if (status == 0) {
      updateField.status = 0;
    }

    await LeadModel.findByIdAndUpdate(
        lead_id,
        updateField,
        { new: true }
    );

    return res.status(201).json({
      status: true,
      message: "Lead tagging created successfully",
      data: leadTagging,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeadTaggings = async (req, res, next) => {
  try {
    const { lead_id } = req.params;
    if (!lead_id) {
        return res.status(400).json({
          status: false,
          message: "lead_id is required"
        });
      }

    const leadTaggings = await LeadTaggingModel.find({ lead_id })
        // .populate("lead_id", "contact_person mobile address")
        .populate("lead_status_id", "status_name") // optional
        .populate("updated_by", "name email"); // optional

    return res.status(200).json({
      status: true,
      message: "Lead taggings fetched successfully",
      data: leadTaggings,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Lead Tagging by ID
exports.getLeadTaggingById = async (req, res, next) => {
  try {
    const leadTagging = await LeadTaggingModel.findById(req.params.id);

    if (!leadTagging) {
      return res.status(404).json({
        status: false,
        message: "Lead tagging not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Lead tagging data fetched successfully",
      data: leadTagging,
    });
  } catch (error) {
    next(error);
  }
};

// Update Lead Tagging
exports.updateLeadTagging = async (req, res, next) => {
  try {
    const { lead_id, lead_status_id, followup_date, remarks } = req.body;

    const leadTagging = await LeadTaggingModel.findByIdAndUpdate(
      req.params.id,
      {
        lead_id,
        lead_status_id,
        next_flowup_date: followup_date,
        remarks,
        updated_by: req.user.userId,
      },
      { new: true, runValidators: true }
    );

    if (!leadTagging) {
      return res.status(404).json({
        status: false,
        message: "Lead tagging not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Lead tagging updated successfully",
      data: leadTagging,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Lead Tagging (Soft Delete)
exports.deleteLeadTagging = async (req, res, next) => {
  try {
    const leadTagging = await LeadTaggingModel.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!leadTagging) {
      return res.status(404).json({
        status: false,
        message: "Lead tagging not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Lead tagging deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
