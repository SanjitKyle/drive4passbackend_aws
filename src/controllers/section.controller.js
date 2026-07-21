const SectionModel = require('../models/section.model');

// Create Section
exports.createSection = async (req, res, next) => {
  try {
    const { section_name } = req.body;

    const newSection = new SectionModel({ section_name });
    await newSection.save();

    res.status(201).json({
      status: true,
      message: 'Section created successfully',
      section: newSection
    });
  } catch (err) {
    next(err);
  }
};

// Get All Sections
exports.getSections = async (req, res, next) => {
  try {
    const sections = await SectionModel.find().sort({ section_name: 1 });
    res.status(200).json({
      status: true,
      message: 'Sections fetched successfully',
      sections: sections
    });
  } catch (err) {
    next(err);
  }
};

// Update Section
exports.updateSection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { section_name } = req.body;

    const updated = await SectionModel.findByIdAndUpdate(id, { section_name }, { new: true });

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: 'Section not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Section updated successfully',
      section: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete Section
exports.deleteSection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await SectionModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Section not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Section deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
