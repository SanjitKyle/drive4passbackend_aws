const FeeInstallmentMasterModel = require("../../models/FEE/feeinstallmentmaster.model");
const { sortInstallmentMonths} = require("../../utils/date.helper");

/**
 * Create
 */
exports.createFeeInstallmentMaster = async (req, res, next) => {
  try {
    const {
      course_id,
      fee_type_id,
      amount,
      installment_months
    } = req.body;

    const branch_id = req.user.branchId;
    const last_updated_by = req.user ? req.user._id : null;

    if (!branch_id) {
      return res.status(401).json({
        status: false,
        message: "Branch not found in token"
      });
    }

    const SESSION_START_MONTH = parseInt(process.env.SESSION_START_MONTH || 1);

	const sortedMonths = sortInstallmentMonths(
	  [...installment_months],
	  SESSION_START_MONTH
	);


    // ❌ Prevent duplicate fee type per course per branch
    const exists = await FeeInstallmentMasterModel.findOne({
      branch_id,
      course_id,
      fee_type_id,
      deletedAt: null
    });

    if (exists) {
      return res.json({
        status: false,
        message: "Fee Type already exists for this course"
      });
    }

    const data = await FeeInstallmentMasterModel.create({
      branch_id,
      course_id,
      fee_type_id,
      amount,
      installment_months: sortedMonths,
      last_updated_by
    });

    return res.status(201).json({
      status: true,
      message: "Fee Installment Master created successfully",
      data
    });

  } catch (err) {
    next(err);
  }
};



/**
 * Get All
 */
exports.getFeeInstallmentMasters = async (req, res, next) => {
  try {
    const list = await FeeInstallmentMasterModel.find({ deletedAt: null })
      .populate("branch_id", "branch_name")
      .populate("course_id", "name")
      .populate("fee_type_id", "feetype_name")
      .populate("last_updated_by", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      status: true,
      message: "Fee Installment Masters fetched successfully",
      data: list
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Get By ID
 */
exports.getFeeInstallmentMasterById = async (req, res, next) => {
  try {
    const data = await FeeInstallmentMasterModel.findById(req.params.id)
      .populate("branch_id", "branch_name")
      .populate("course_id", "name")
      .populate("fee_type_id", "feetype_name");

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Record not found"
      });
    }

    return res.json({
      status: true,
      message: "Record fetched successfully",
      data
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Update (POST)
 */
exports.updateFeeInstallmentMaster = async (req, res, next) => {
  try {
    const last_updated_by = req.user ? req.user._id : null;

    const updated = await FeeInstallmentMasterModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, last_updated_by },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: false,
        message: "Record not found"
      });
    }

    return res.json({
      status: true,
      message: "Fee Installment Master updated successfully",
      data: updated
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Soft Delete
 */
exports.deleteFeeInstallmentMaster = async (req, res, next) => {
  try {
    const deleted = await FeeInstallmentMasterModel.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), status: 0 },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Record not found"
      });
    }

    return res.json({
      status: true,
      message: "Fee Installment Master deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};
