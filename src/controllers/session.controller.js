const SessionModel = require('../models/session.model');

// Create Session
exports.createSession = async (req, res, next) => {
  try {
    if (req.body.is_active) {
      await SessionModel.updateMany({}, { is_active: false });
    }
    const session = await SessionModel.create(req.body);
    res.status(201).json({status: true, message: 'Session created successfully.', session});
  } catch (err) {
    next(err);
  }
};

// Get All Sessions
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await SessionModel.find().sort({ start_date: -1 });
    res.status(200).json({status: true, message: 'Session fetched successfully', sessions});
  } catch (err) {
    next(err);
  }
};

// Get Session By ID
exports.getSessionById = async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.json({status: false ,message: 'Session not found' });
    res.status(200).json({status: true, message: 'Session data fetched successfully', session});    
  } catch (err) {
    next(err);
  }
};

// Update Session
exports.updateSession = async (req, res, next) => {
  try {
    if (req.body.is_active) {
      await SessionModel.updateMany({}, { is_active: false });
    }
    const session = await SessionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.json({ status: false, message: 'Session not found' });
    res.json({status: true, message: 'Session data updated successfully', session});    
  } catch (err) {
    next(err);
  }
};

// Delete Session
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await SessionModel.findByIdAndDelete(req.params.id);
    if (!session) return res.json({ status: false, message: 'Session not found' });
    res.json({ status: true,  message: 'Session deleted successfully' });
  } catch (err) {
    next(err);
  }
};
