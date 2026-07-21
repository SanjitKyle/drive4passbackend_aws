const LeadSource = require("../../models/LMS/leadsource.model");

// Create Lead Source
exports.createLeadSource = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    // prevent duplicate
    const exists = await LeadSource.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (exists) {
      return res.status(400).json({ status: false, message: "Lead Source already exists" });
    }

    const leadSource = new LeadSource({ name, description });
    await leadSource.save();

    return res.status(201).json({
      status: true,
      message: "Lead Source created successfully",
      data: leadSource,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Lead Sources
exports.getLeadSources = async (req, res, next) => {
  try {
    const sources = await LeadSource.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      message: "Lead Sources fetched successfully",
      data: sources,
    });
  } catch (err) {
    next(err);
  }
};

// Update Lead Source
exports.updateLeadSource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, is_active } = req.body;

    // prevent duplicate on update
    if (name) {
      const exists = await LeadSource.findOne({ _id: { $ne: id }, name: { $regex: `^${name}$`, $options: "i" } });
      if (exists) {
        return res.status(400).json({ status: false, message: "Lead Source with this name already exists" });
      }
    }

    const leadSource = await LeadSource.findByIdAndUpdate(
      id,
      { name, description, is_active },
      { new: true }
    );

    if (!leadSource) {
      return res.status(404).json({ status: false, message: "Lead Source not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Lead Source updated successfully",
      data: leadSource,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Lead Source
exports.deleteLeadSource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leadSource = await LeadSource.findByIdAndDelete(id);

    if (!leadSource) {
      return res.status(404).json({ status: false, message: "Lead Source not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Lead Source deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
