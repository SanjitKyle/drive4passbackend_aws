const LeadStatusModel = require("../../models/LMS/leadstatus.model");

// Create Lead Status
exports.createLeadStatus = async (req, res, next) => {
  try {
    const status_name = req.body.status_name;
    const created_by = req.user ? req.user._id : null;

    const exists = await LeadStatusModel.findOne({
      status_name: status_name,
      deletedAt: null
    });
    if (exists) {
      return res.json({
        status: false,
        message: "Lead status already exists"
      });
    }

    const statusData = new LeadStatusModel({ status_name, created_by });
    await statusData.save();

    return res.status(201).json({
      status: true,
      message: "Lead status created successfully",
      data: statusData
    });
  } catch (err) {
    next(err);
  }
};

// Get All Lead Statuses
exports.getAllLeadStatus = async (req, res, next) => {
  try {
    const statuses = await LeadStatusModel.find({ deletedAt: null }).sort({ createdAt: -1 });

    return res.json({
      status: true,
      message: "Lead statuses fetched successfully",
      data: statuses
    });
  } catch (err) {
    next(err);
  }
};

// Update Lead Status
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status_name } = req.body;

    const exists = await LeadStatusModel.findOne({
      status_name: status_name.trim(),
      _id: { $ne: id },
      deletedAt: null
    });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Lead status already exists"
      });
    }

    const updated = await LeadStatusModel.findByIdAndUpdate(
      id,
      { status_name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Lead status not found"
      });
    }

    return res.json({
      status: true,
      message: "Lead status updated successfully",
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete Lead Status (Soft Delete)
exports.deleteLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await LeadStatusModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Lead status not found"
      });
    }

    return res.json({
      status: true,
      message: "Lead status deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};
