const LeadTypeModel = require("../../models/LMS/leadtype.model");

class LeadTypeController {
  // Create Lead Type
  static async createLeadType(req, res, next) {
    try {
      const type_name = req.body.type_name;
      const created_by = req.user ? req.user._id : null;

      // Prevent duplicate type_name
      const existing = await LeadTypeModel.findOne({ type_name: type_name, deletedAt: null });
      if (existing) {
        return res.status(400).json({ status: false, message: "Lead type already exists" });
      }

      const leadType = new LeadTypeModel({ type_name, created_by });
      await leadType.save();

      return res.status(201).json({ status: true, message: "Lead type created successfully", data: leadType });
    } catch (err) {
      next(err);
    }
  }

  // Get all Lead Types
  static async getAllLeadTypes(req, res, next) {
    try {
      const leadTypes = await LeadTypeModel.find({ deletedAt: null }).sort({ createdAt: -1 });
      return res.status(200).json({ status: true, message: "Lead types fetched successfully", data: leadTypes });
    } catch (err) {
      next(err);
    }
  }

  // Get Lead Type by ID
  static async getLeadTypeById(req, res, next) {
    try {
      const leadType = await LeadTypeModel.findOne({ _id: req.params.id, deletedAt: null });
      if (!leadType) {
        return res.status(404).json({ status: false, message: "Lead type not found" });
      }
      return res.status(200).json({ status: true, message: "Lead type fetched successfully", data: leadType });
    } catch (err) {
      next(err);
    }
  }

  // Update Lead Type (using POST for update)
  static async updateLeadType(req, res, next) {
    try {
      const { type_name, created_by } = req.body;

      // Prevent duplicate type_name
      const existing = await LeadTypeModel.findOne({ type_name: type_name.trim(), deletedAt: null, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ status: false, message: "Lead type already exists" });
      }

      const updatedLeadType = await LeadTypeModel.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { type_name, created_by },
        { new: true }
      );

      if (!updatedLeadType) {
        return res.status(404).json({ status: false, message: "Lead type not found" });
      }

      return res.status(200).json({ status: true, message: "Lead type updated successfully", data: updatedLeadType });
    } catch (err) {
      next(err);
    }
  }

  // Soft Delete Lead Type
  static async deleteLeadType(req, res, next) {
    try {
      const deletedLeadType = await LeadTypeModel.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
      );

      if (!deletedLeadType) {
        return res.status(404).json({ status: false, message: "Lead type not found" });
      }

      return res.status(200).json({ status: true, message: "Lead type deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LeadTypeController;
