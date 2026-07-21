const PriceMaster = require("../../models/DS/price_master.model");
const Branch = require("../../models/branch.model");
const PackageMaster = require("../../models/DS/package_master.model");
const areaModel = require("../../models/DS/area.model");
const pupilModel = require("../../models/DS/pupil.model");

exports.createPrice = async (req, res, next) => {
  try {
    const { branch_id, package_id, price } = req.body;
    const school_id = req.user.school_id;

    if (!branch_id || !package_id || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "branch_id, package_id and price are required",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    // 🔒 Validate Branch
    const branch = await areaModel.findOne({
      _id: branch_id,
      school_id,
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found or unauthorized",
      });
    }

    // 🔒 Validate Package
    const packageData = await PackageMaster.findOne({
      _id: package_id,
      school_id,
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found or unauthorized",
      });
    }

    const priceData = await PriceMaster.create({
      school_id,
      branch_id,
      package_id,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Price created successfully",
      data: priceData,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Price already exists for this package & branch",
      });
    }
    next(error);
  }
};


/**
 * GET ALL Prices (same school only)
 */
exports.getPrices = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const prices = await PriceMaster.find({ school_id })
      .populate("branch_id", "name")
      .populate("package_id", "package_name duration");

    
     const filteringPrices=prices.filter((price)=>price.package_id!==null && price.branch_id!==null);

    return res.status(200).json({
      success: true,
      data: filteringPrices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET Single Price
 */
exports.getPriceById = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const price = await PriceMaster.findOne({
      _id: req.params.id,
      school_id,
    })
      .populate("branch_id")
      .populate("package_id", "package_name duration");
    

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price not found or unauthorized",
      });
    }

     if(price.branch_id===null)
     {
      return res.status(404).json({
        message:'price does not have branch  id ',
        success:false
      })
     }
     if(price.package_id===null)
     {
      return res.status(404).json({
        messgae:'price does not have package id ',
        success:false
      })
     }
    return res.status(200).json({
      success: true,
      data: price,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE Price
 */
exports.updatePrice = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const package_id=req.body.package_id

    if (
      req.body.price !== undefined &&
      (typeof req.body.price !== "number" || req.body.price < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    // 1️⃣ Update price master
    const updated = await PriceMaster.findOneAndUpdate(
      { _id: req.params.id, school_id },
      { $set: { price: req.body.price } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Price not found or unauthorized",
      });
    }

    // 2️⃣ Update all pupils with same package + branch
    await pupilModel.updateMany(
      {
        package_id: updated.package_id,
        school_id: updated.school_id,
      },
      {
        $set: { pricing: updated.price },
      }
    );

    const pupils=await pupilModel.find({package_id});
    console.log('pupils',pupils)
    return res.status(200).json({
      success: true,
      message: "Price and pupils updated successfully",
      data: updated,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE Price
 */
exports.deletePrice = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const deleted = await PriceMaster.findOneAndDelete({
      _id: req.params.id,
      school_id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Price not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Price deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
