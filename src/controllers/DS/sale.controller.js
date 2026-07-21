const Sale = require("../../models/DS/sale.model");
const Pupil = require("../../models/DS/pupil.model");
const mongoose = require("mongoose");
const { createCreditLog } = require("./pupil_credits_log.controller");
const Package = require("../../models/DS/package_master.model");
const Price = require("../../models/DS/price_master.model");
const package_masterModel = require("../../models/DS/package_master.model");
const bookingModel = require("../../models/DS/booking.model");

// Allowed fields
const allowedFields = [
  "pupil_id",
  "package_id",
  "credited_hour",
  "area_id",
];

const pickFields = (data) => {
  const filtered = {};
  allowedFields.forEach((key) => {
    if (data[key] !== undefined) filtered[key] = data[key];
  });
  return filtered;
};

/* =========================
   CREATE SALE
========================= */
exports.createSale = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!req.user || !req.user._id || !req.user.school_id) {
      throw Object.assign(new Error("Unauthorized"), { status: 401 });
    }

    const data = pickFields(req.body);
    const { email, pupil_id, full_name, phone } = req.body;

    if (!data.package_id || !data.area_id) {
      throw Object.assign(new Error("Missing required fields"), {
        status: 400,
      });
    }

    // Get package details
    const packageData = await package_masterModel
      .findById(data.package_id)
      .session(session);

    if (!packageData || !packageData.duration) {
      throw new Error("Package not found");
    }

    // =========================
    // Find pupil by pupil_id OR email
    // =========================
    // =========================
    // Find pupil by pupil_id OR email
    // =========================
    let pupil;

    if (pupil_id) {
      pupil = await Pupil.findOne({
        _id: pupil_id,
        school_id: req.user.school_id,
      }).session(session);

    } else if (email) {

      pupil = await Pupil.findOne({
        email,
        school_id: req.user.school_id,
      }).session(session);

      // Create pupil if not found
      if (!pupil) {
        pupil = await Pupil.create(
          [
            {
              email,
              phone,
              full_name,
              school_id: req.user.school_id,
              created_by: req.user._id,
              total_credit: 0,
              remaining_hour: 0,
              total_packages_price: 0,
            },
          ],
          { session }
        );

        pupil = pupil[0];
      }

    } else {
      throw Object.assign(
        new Error("pupil_id or email is required"),
        { status: 400 }
      );
    }

    if (!pupil) {
      throw Object.assign(new Error("Pupil not found"), {
        status: 404,
      });
    }

    // Assign pupil_id from found pupil
    data.pupil_id = pupil._id;

    data.school_id = req.user.school_id;
    data.created_by = req.user._id;
    data.credited_hour = packageData.duration;

    // Create sale
    const sale = await Sale.create([data], { session });

    if (!sale) {
      throw new Error("Cannot create sale");
    }

    const credit_hours = packageData.duration;
    const school_id = req.user.school_id;

    // Create credit log
    const creditResult = await createCreditLog(
      {
        pupil_id: pupil._id,
        credit_hours,
        reference: "sale",
        school_id,
        created_by: data.created_by,
      },
      session
    );

    if (!creditResult.success) {
      throw new Error("Could not insert credit log");
    }

    // Get pricing
    const pricing = await Price.findOne({
      package_id: data.package_id,
    }).session(session);

    // Update pupil credits
    pupil.total_credit =
      (pupil.total_credit || 0) + (data.credited_hour || 0);

    pupil.total_packages_price =
      (pupil.total_packages_price || 0) + (pricing?.price || 0);

    // Calculate remaining hours
    const bookings = await bookingModel
      .find({
        pupil_id: pupil._id,
        school_id,
      })
      .session(session);

    const totalSpent = bookings.reduce(
      (sum, b) =>
        sum + (b.status !== "cancelled" ? Number(b.credit_use) || 0 : 0),
      0
    );

    const remaining = pupil.total_credit - totalSpent;

    pupil.remaining_hour = remaining;

    await pupil.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: sale[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    next(error);
  }
};

/* =========================
   GET ALL SALES (SCHOOL)
========================= */
exports.getAllSales = async (req, res, next) => {
  try {
    if (!req.user || !req.user.school_id) {
      return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    }

    const sales = await Sale.find({
      deleted_at: null,
      school_id: req.user.school_id,
    })
      .populate("school_id", "school_name")
      .populate("pupil_id", "full_name email")
      .populate("package_id", "name duration")
      .populate("area_id", "name")
      .populate("created_by", "name email")
      .populate("deleted_by", "name email");

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET SALE BY ID (SCHOOL)
========================= */
exports.getSaleById = async (req, res, next) => {
  try {
    if (!req.user || !req.user.school_id) {
      return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(Object.assign(new Error("Invalid Sale ID"), { status: 400 }));
    }

    const sale = await Sale.findOne({
      _id: id,
      deleted_at: null,
      school_id: req.user.school_id,
    })
      .populate("school_id", "school_name")
      .populate("pupil_id", "full_name email")
      .populate("package_id", "name duration")
      .populate("area_id", "name")
      .populate("created_by", "name email")
      .populate("deleted_by", "name email");

    if (!sale) {
      return next(Object.assign(new Error("Sale not found"), { status: 404 }));
    }

    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE SALE
========================= */
exports.updateSale = async (req, res, next) => {
  try {
    if (!req.user || !req.user.school_id) {
      return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(Object.assign(new Error("Invalid Sale ID"), { status: 400 }));
    }

    const sale = await Sale.findOne({
      _id: id,
      deleted_at: null,
      school_id: req.user.school_id,
    });

    if (!sale) {
      return next(Object.assign(new Error("Sale not found"), { status: 404 }));
    }

    const data = pickFields(req.body);
    data.updated_by = req.user._id;

    const packageIdToUse = data.package_id || sale.package_id;
    let newCredited = sale.credited_hour || 0;

    if (packageIdToUse) {
      const packageData = await package_masterModel.findById(packageIdToUse);
      if (packageData && packageData.duration !== undefined) {
        newCredited = packageData.duration;
      }
    }

    data.credited_hour = newCredited;

    const oldCredited = sale.credited_hour || 0;
    const diff = newCredited - oldCredited;

    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );

    if (diff !== 0) {
      const pupil = await Pupil.findById(sale.pupil_id);
      if (pupil) {
        pupil.total_credit = (pupil.total_credit || 0) + diff;
        pupil.remaining_hour = (pupil.remaining_hour || 0) + diff;
        await pupil.save();
      }
    }

    res.status(200).json({ success: true, data: updatedSale });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE SALE (SOFT)
========================= */
exports.deleteSale = async (req, res, next) => {
  try {
    if (!req.user || !req.user.school_id) {
      return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(Object.assign(new Error("Invalid Sale ID"), { status: 400 }));
    }

    const sale = await Sale.findOne({
      _id: id,
      deleted_at: null,
      school_id: req.user.school_id,
    });

    if (!sale) {
      return next(Object.assign(new Error("Sale not found"), { status: 404 }));
    }

    await Sale.findByIdAndUpdate(id, {
      deleted_at: new Date(),
      deleted_by: req.user._id,
      updated_by: req.user._id,
    });

    res
      .status(200)
      .json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getSaleByPupilId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sales = await Sale.find({ pupil_id: id, deleted_at: null }).populate('package_id');
    console.log('sales', sales)
    if (!sales || sales.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sales found for this pupil",
      });
    }
    return res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
