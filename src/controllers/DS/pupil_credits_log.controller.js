const pupilCreditLogs = require("../../models/DS/pupil_credit_logs.model");

/**
 * Create credit log
 */
exports.createCreditLog = async (obj, session) => {
  try {
    const { pupil_id, credit_hours, reference, created_by, school_id ,reference_id} = obj;

    if (!pupil_id || credit_hours === undefined || !reference) {
      return {
        success: false,
        message: "pupil_id, credit_hours and reference are required",
      };
    }

    const creditValue = Number(credit_hours);
    if (isNaN(creditValue)) {
      return { success: false, message: "credit_hours must be a number" };
    }

    const log = await pupilCreditLogs.create(
      [
        {
          school_id,
          pupil_id,
          credit_hours: creditValue,
          reference,
          created_by,
          reference_id
        },
      ],
      { session },
    );

    return { success: true, data: log };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Get logs by pupil_id
 */
exports.getLogsByPupil = async (req, res, next) => {
  try {
    const pupil_id = req.params.id;
    const school_id = req.user.school_id;

    if (!pupil_id) {
      return res.status(400).json({
        success: false,
        message: "Pupil id is required",
      });
    }

    const logs = await pupilCreditLogs
      .find({ pupil_id, school_id , deleted_at:null})
      .sort({ createdAt: -1 });
      if(!logs)
      {
        return res.status(404).json({
          message:'no logs found ',
          sucess:false
        })
      }

    return res.status(200).json({
      success: true,
      message: "Pupil credit logs fetched successfully",
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("error", error);
    next(error);
  }
};
