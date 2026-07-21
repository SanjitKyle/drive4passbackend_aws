const PackageMaster = require("../../models/DS/package_master.model");

/**
 * CREATE Package
 * school_id is taken ONLY from auth user
 */
exports.createPackageMaster = async (req, res, next) => {
  try {
    const { package_name, package_slug, duration ,area} = req.body;
    const school_id = req.user.school_id;

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
      school_id,
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
 * GET ALL Packages (same school only)
 */
exports.getPackagesMaster = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const packages = await PackageMaster.find({ school_id }).populate('area');

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
exports.getPackagesByArea=async(req,res)=>{
  try{
    
    const packages=await PackageMaster.find({area:req.params.id});
    if(!packages)
    {
      return res.status(404).json({
        message:"Could not found packages with the specific id",
        sucess:false
      })
    }
     return res.status(201).json({
      message:"Sucessfully get packages",
      packages:packages
     })


  }catch(error)
  {
    console.log('error',error);
    return res.status(501).json({
      message:"Internal server error ",
      sucess:false
    })
  }
}

/**
 * GET Single Package (same school only)
 */
exports.getSpecificMaster = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const packageData = await PackageMaster.findOne({
      _id: req.params.id,
      school_id,
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
 * UPDATE Package (same school only)
 */
exports.updatePackageMaster = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    // ❌ prevent changing school
    delete req.body.school_id;

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
      { _id: req.params.id, school_id },
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
 * DELETE Package (same school only)
 */
exports.deletePackageMaster = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const deleted = await PackageMaster.findOneAndDelete({
      _id: req.params.id,
      school_id,
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
