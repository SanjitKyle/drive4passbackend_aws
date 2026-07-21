const InstituteModel = require("../../models/LMS/institute.model");

// ✅ Create Institute
exports.createInstitute = async (req, res, next) => {
  try {
    const { institute_name } = req.body;

    if (!institute_name) {
      return res.status(400).json({
        status: false,
        message: "Institute name is required",
      });
    }

    // Check for duplicate (case-insensitive)
    const existingInstitute = await InstituteModel.findOne({
      institute_name: { $regex: `^${institute_name}$`, $options: "i" },
      deletedAt: null,
    });

    if (existingInstitute) {
      return res.status(409).json({
        status: false,
        message: "Institute name already exists",
      });
    }

    const institute = new InstituteModel({ institute_name });
    await institute.save();

    return res.status(201).json({
      status: true,
      message: "Institute created successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Institutes (exclude soft deleted)
exports.getInstitutes = async (req, res, next) => {
  try {
    const institutes = await InstituteModel.find({ deletedAt: null }).sort({ sl_no: 1 });

    return res.status(200).json({
      status: true,
      message: "Institutes fetched successfully",
      data: institutes,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Single Institute by ID (exclude soft deleted)
exports.getInstituteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const institute = await InstituteModel.findOne({ _id: id, deletedAt: null });
    if (!institute) {
      return res.status(404).json({
        status: false,
        message: "Institute not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Institute fetched successfully",
      data: institute,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Institute (only if not soft deleted)
exports.updateInstitute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { institute_name } = req.body;

     if (!institute_name) {
      return res.status(400).json({
        status: false,
        message: "Institute name is required",
      });
    }

     // ✅ Check for duplicate (excluding current doc)
    const existingInstitute = await InstituteModel.findOne({
      _id: { $ne: id },
      institute_name: { $regex: `^${institute_name}$`, $options: "i" },
      deletedAt: null,
    });

    if (existingInstitute) {
      return res.status(409).json({
        status: false,
        message: "Institute name already exists",
      });
    }

    const updatedInstitute = await InstituteModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { institute_name },
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({
        status: false,
        message: "Institute not found or already deleted",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Institute updated successfully",
      data: updatedInstitute,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteInstitute = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedInstitute = await InstituteModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedInstitute) {
      return res.status(404).json({
        status: false,
        message: "Institute not found or already deleted",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Institute soft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
