const BranchModel = require('../../models/DS/area.model');

// Create Branch
exports.createBranch = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      name,
      areacode,
      status
    } = req.body;

    const dataObj = {
      name,
      areacode,
      status,
      created_by: userId,
      last_updated_by: userId
    };

    const branch = await BranchModel.create(dataObj);
    res.status(201).json({ status: true, message: 'Branch created successfully.', branch });
  } catch (err) {
    next(err);
  }
};

// Get all branches
exports.getAllBranches = async (req, res, next) => {
  try {
    const branches = await BranchModel.find()
      .populate('created_by')
      .populate('last_updated_by');

    res.status(200).json({ status: true, message: 'Branches fetched successfully', branches });
  } catch (err) {
    next(err);
  }
};

// Get branch by ID
exports.getBranchById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const branch = await BranchModel.findOne({ _id: id })
      .populate('created_by')
      .populate('last_updated_by');

    if (!branch) return res.status(404).json({ status: false, message: 'Branch not found.' });

    res.status(200).json({ status: true, message: 'Branch data fetched successfully', branch });
  } catch (err) {
    next(err);
  }
};

// Update branch
exports.updateBranch = async (req, res, next) => {
  try {
    const userId = req.user._id;
    req.body.last_updated_by = userId;

    const branch = await BranchModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!branch) return res.status(404).json({ status: false, message: 'Branch not found' });

    res.status(200).json({ status: true, message: 'Branch updated successfully', branch });
  } catch (err) {
    next(err);
  }
};

// Delete branch
exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await BranchModel.findOneAndDelete({ _id: req.params.id });

    if (!branch) return res.status(404).json({ status: false, message: 'Branch not found' });

    res.status(200).json({ status: true, message: 'Branch deleted successfully' });
  } catch (err) {
    next(err);
  }
};