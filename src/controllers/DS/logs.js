const ActivityLogs = require("../../models/DS/logs");

// Create Log
exports.createLog = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const created_by = req.user._id;
    const { activity, enquire_id } = req.body;

    if (!activity) {
      return res.status(400).json({
        success: false,
        message: "Activity is required"
      });
    }

    const log = await ActivityLogs.create({
      school_id,
      activity,
      enquire_id,
      created_by
    });

    return res.status(201).json({
      success: true,
      message: "Log created successfully",
      data: log
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Logs
exports.getLogs = async (req, res) => {
  try {
    const school_id = req.user.school_id;

    const logs = await ActivityLogs
      .find({ school_id })
      .populate("created_by", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Log
exports.getLogById = async (req, res) => {
  try {
    const log = await ActivityLogs
      .findById(req.params.id)
      .populate("created_by", "name email");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: log
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Log
exports.deleteLog = async (req, res) => {
  try {
    const log = await ActivityLogs.findByIdAndDelete(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Log deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Logs by User
exports.getLogsByUser = async (req, res) => {
  try {
    const created_by = req.user._id;
    const school_id = req.user.school_id;

    const logs = await ActivityLogs
      .find({
        created_by,
        school_id
      })
      .populate("created_by", "name email")
      .sort({ createdAt: -1 });

    if (!logs.length) {
      return res.status(404).json({
        success: false,
        message: "No logs found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// get logs by enquire id
exports.getLogsByEnquireId = async (req, res) => {
  try {
    const { enquire_id } = req.params;
    const school_id = req.user.school_id;
    const logs = await ActivityLogs
      .find({
        enquire_id,
        school_id
      })
      .populate("created_by", "name email")
      .sort({ createdAt: -1 });
    if (!logs.length) {
      return res.status(404).json({
        success: false,
        message: "No logs found for this enquire"
      });
    }
    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}