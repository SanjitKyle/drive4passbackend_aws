const SpecializationModel = require('../models/specialization.model');

// Create SpecializationModel
exports.createSpecialization = async (req, res, next) => {
  try {
    const specialization = await SpecializationModel.create(req.body);
    res.status(201).json({status: true, message: 'Specialization created successfully', specialization});
  } catch (err) {
    next(err);
  }
};

exports.getSpecializations = async (req, res, next) => {
  try {
    const specializations = await SpecializationModel.find();
    res.json({status: true, message: 'Specialization fetched successfully', specializations});
  } catch (err) {
    next(err);
  }
};

exports.updateSpecialization = async (req, res, next) => {
  try {
    const specialization = await SpecializationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!specialization) return res.json({ status: false, message: 'Specialization not found' });
    res.json({status: true, message: 'Specialization updated successfully', specialization}); 
  } catch (err) {
    next(err);
  }
};

exports.deleteSpecialization = async (req, res, next) => {
  try {

    const specialization = await SpecializationModel.findByIdAndDelete(req.params.id);
    if (!specialization) return res.json({ status: false, message: 'SpecializationModel not found' });
    res.json({ status: true, message: 'Specialization deleted successfully' });
  } catch (err) {
    next(err);
  }
};