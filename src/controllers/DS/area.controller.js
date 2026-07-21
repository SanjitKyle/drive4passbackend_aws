const BranchModel = require('../../models/DS/area.model');
const SchoolModel = require('../../models/school.model'); // Required for checking if school exists

// Create Branch
exports.createBranch = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const school_id = req.user.school_id;

    if (!school_id) {
      return res.status(400).json({ status: false, message: 'School ID is required.' });
    }

    const school = await SchoolModel.findById(school_id);
    if (!school) {
      return res.status(404).json({ status: false, message: 'School not found.' });
    }

    const {
      name,
      code,
      address,
      postcode,
      contact_email,
      phone,
      status,
      branch_currency,
      currency_symbol,
      branch_timezones
    } = req.body;

    const dataObj = {
      name,
      code,
      address,
      postcode,
      contact_email,
      phone,
      status,
      branch_currency,
      currency_symbol,
      branch_timezones,
      school_id,
      created_by: userId,
      last_updated_by: userId
    };

    const branch = await BranchModel.create(dataObj);
    res.status(201).json({ status: true, message: 'Branch created successfully.', branch });
  } catch (err) {
    next(err);
  }
};

// Get all branches for user's school
exports.getAllBranches = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const branches = await BranchModel.find({ school_id })
      .populate('school_id')
      .populate('created_by')
      .populate('last_updated_by');

    res.status(200).json({ status: true, message: 'Branches fetched successfully', branches });
  } catch (err) {
    next(err);
  }
};

// Get branch by ID (only if belongs to user's school)
exports.getBranchById = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const id = req.params.id;

    const branch = await BranchModel.findOne({ _id: id, school_id })
      .populate('school_id')
      .populate('created_by')
      .populate('last_updated_by');

    if (!branch) return res.status(404).json({ status: false, message: 'Branch not found.' });

    res.status(200).json({ status: true, message: 'Branch data fetched successfully', branch });
  } catch (err) {
    next(err);
  }
};

// Update branch (only if belongs to user's school)
exports.updateBranch = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const school_id = req.user.school_id;
    req.body.last_updated_by = userId;

    const branch = await BranchModel.findOneAndUpdate(
      { _id: req.params.id, school_id },
      req.body,
      { new: true }
    );

    if (!branch) return res.status(404).json({ status: false, message: 'Branch not found' });

    res.status(200).json({ status: true, message: 'Branch updated successfully', branch });
  } catch (err) {
    next(err);
  }
};

// Delete branch (only if belongs to user's school)
exports.deleteBranch = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const branch = await BranchModel.findOneAndDelete({ _id: req.params.id, school_id });

    if (!branch) return res.status(404).json({ status: false, message: 'Branch not found' });

    res.status(200).json({ status: true, message: 'Branch deleted successfully' });
  } catch (err) {
    next(err);
  }
};