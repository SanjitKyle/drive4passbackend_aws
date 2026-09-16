const PackageMaster = require("../../models/DS/package_master.model");

/**
 * CREATE Package
 */
exports.createPackageMaster = async (req, res, next) => {
  try {
    const { package_name, package_slug, duration, area } = req.body;

    if (!package_name || !package_slug || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (typeof duration !== "number" || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number",
      });
    }

    const packageData = await PackageMaster.create({
      package_name,
      package_slug,
      duration,
      area
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: packageData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL Packages
 */
exports.getPackagesMaster = async (req, res, next) => {
  try {
    const packages = await PackageMaster.find().populate('area');

    return res.status(200).json({
      success: true,
      message: "Packages fetched successfully",
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

/***
 * get all packages by area
 */
exports.getPackagesByArea = async (req, res) => {
  try {
    const packages = await PackageMaster.find({ area: req.params.id });
    if (!packages) {
      return res.status(404).json({
        message: "Could not found packages with the specific id",
        sucess: false
      });
    }
    return res.status(201).json({
      message: "Sucessfully get packages",
      packages: packages
    });
  } catch (error) {
    console.log('error', error);
    return res.status(501).json({
      message: "Internal server error ",
      sucess: false
    });
  }
};

/**
 * GET Single Package
 */
exports.getSpecificMaster = async (req, res, next) => {
  try {
    const packageData = await PackageMaster.findOne({
      _id: req.params.id,
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package fetched successfully",
      data: packageData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE Package
 */
exports.updatePackageMaster = async (req, res, next) => {
  try {
    if (
      req.body.duration !== undefined &&
      (typeof req.body.duration !== "number" || req.body.duration <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number",
      });
    }

    const updated = await PackageMaster.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Package not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE Package
 */
exports.deletePackageMaster = async (req, res, next) => {
  try {
    const deleted = await PackageMaster.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Package not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
