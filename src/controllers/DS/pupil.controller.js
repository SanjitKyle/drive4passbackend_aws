const Pupil = require("../../models/DS/pupil.model");
const InstructorMaster = require("../../models/DS/instructor_master.model");
const PackageMaster = require("../../models/DS/package_master.model");
const price_masterModel = require("../../models/DS/price_master.model");
const mongoose = require("mongoose");
const { createPupilCredits } = require("./pupil_credits_controller");
const UserModel = require("../../models/user.model");
const bookingModel = require("../../models/DS/booking.model");
const { InsertIntoSell } = require("../../utils/InsertingIntoSell");
const pupil_credit_logsModel = require("../../models/DS/pupil_credit_logs.model");
const saleModel = require("../../models/DS/sale.model");
const pupil_creditsModel = require("../../models/DS/pupil_credits.model");
const moneyModel = require("../../models/DS/money.model");
// CREATE a new pupil
exports.createPupil = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!req.user || !req.user._id) {
      throw new Error("Unauthorized");
    }

    const { full_name, phone, email, instructor_id, area_id, package_id } =
      req.body;

    if (!full_name || !phone || !email || !instructor_id || !package_id) {
      throw new Error("Missing required fields.");
    }

    const created_by = req.user._id;

    // Instructor
    const instructor =
      await InstructorMaster.findById(instructor_id).session(session);

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    const school_id = instructor.school_id;

    // Package
    const packageData =
      await PackageMaster.findById(package_id).session(session);

    if (!packageData) {
      throw new Error("Package not found");
    }

    const totalHour = packageData.duration;

    // Create pupil
    const pupil = await Pupil.create(
      [
        {
          full_name,
          phone,
          email,
          instructor_id,
          area_id,
          package_id,
          total_credit: totalHour,
          remaining_hour: totalHour, // Initialize remaining hours
          school_id,
          pricing: 0,
          active: 1,
          created_by,
        },
      ],
      { session },
    );

    const pupil_id = pupil[0]._id;

    console.log("pupil", pupil);

    // Get pricing
    const pricingData = await price_masterModel
      .findOne({
        package_id: package_id,
      })
      .session(session);

    const price =
      (pupil[0].total_packages_price ? pupil[0].total_packages_price : 0) +
      (pricingData?.price || 0);

    // Update pupil pricing
    await Pupil.findByIdAndUpdate(
      pupil_id,
      { $set: { total_packages_price: price } },
      { new: true, session },
    );

    // insert into sell table
    const credited_hour = packageData.duration;
    const data = { pupil_id, package_id, credited_hour, created_by, school_id };

    const response = await InsertIntoSell(data, session); // session added

    console.log("response to insert into", response);

    if (!response) {
      throw new Error("could not insert into sell table");
    }

    // Create credits
    const creditResult = await createPupilCredits(
      {
        pupil_id,
        credits: packageData.duration,
        reference: "sale",
        school_id,
        user: created_by,
      },
      session,
    );

    if (!creditResult.success) {
      throw new Error(creditResult.message);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: pupil[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    next(error);
  }
};
// UPDATE a pupil
exports.updatePupil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    // Validate Pupil ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid Pupil ID");
      err.status = 400;
      return next(err);
    }

    // Check logged-in user
    if (!req.user || !req.user._id) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    const data = ({
      full_name,
      phone,
      email,
      instructor_id,
      area_id,

      active,
      progress,
    } = req.body);

    const datatosend = {
      full_name,
      phone,
      email,
      instructor_id,
      area_id,
      active,
      progress
    }

    if (Object.keys(data).length === 0) {
      const err = new Error("No valid fields to update");
      err.status = 400;
      return next(err);
    }





    // Optional: if status is sent, ensure it’s 0 or 1
    if (data.status !== undefined) {
      if (![0, 1].includes(data.status)) {
        const err = new Error(
          "Invalid status value. Must be 0 (inactive) or 1 (active).",
        );
        err.status = 400;
        return next(err);
      }
    }

    // Update pupil
    const updatedPupil = await Pupil.findOneAndUpdate(
      { _id: id, deleted_at: null, school_id },
      { $set: datatosend },
      { new: true, runValidators: true },
    );

    if (!updatedPupil) {
      const err = new Error("Pupil not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: updatedPupil });
  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000 && error.keyValue.email) {
      const err = new Error("Email already exists.");
      err.status = 400;
      return next(err);
    }
    next(error);
  }
};
// GET all pupils
exports.getAllPupils = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const pupils = await Pupil.find({ deleted_at: null, school_id })
      .populate("instructor_id")
      .populate("school_id")
      .populate("package_id")
      .populate("area_id")
      .populate("created_by")
      .populate("updated_by")
      .populate("deleted_by");

    res.status(200).json({ success: true, data: pupils });
  } catch (error) {
    next(error);
  }
};
// GET single pupil by ID
exports.getPupilById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid Pupil ID");
      err.status = 400;
      return next(err);
    }

    const pupil = await Pupil.findOne({ _id: id, deleted_at: null, school_id })
      .populate("instructor_id")
      .populate("school_id")
      .populate("package_id")
      .populate("area_id")
      .populate("created_by")
      .populate("updated_by")
      .populate("deleted_by");

    if (!pupil) {
      const err = new Error("Pupil not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: pupil });
  } catch (error) {
    next(error);
  }
};
// SOFT DELETE a pupil
exports.deletePupil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid Pupil ID");
      err.status = 400;
      return next(err);
    }

    if (!req.user || !req.user._id) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    // soft deleting everything like bookings , logs, sell, credits , money

    await bookingModel.updateMany(
      { pupil_id: id, deleted_at: null },
      {
        $set: {
          deleted_by: req.user._id,
          deleted_at: new Date()
        }
      }
    );
    await pupil_credit_logsModel.updateMany({ pupil_id: id, deleted_at: null }, {
      $set: {
        deleted_at: new Date(),
        deleted_by: req.user._id
      }
    });
    await saleModel.updateMany({ pupil_id: id, deleted_at: null }, {
      $set: {
        deleted_at: new Date(),
        deleted_by: req.user._id
      }
    });
    await pupil_creditsModel.updateMany({ pupil_id: id, deleted_at: null }, { $set: { deleted_at: new Date(), deleted_by: req.user._id } })
    await moneyModel.updateMany({ pupil_id: id, deleted_at: null }, {
      $set: {
        deleted_at: new Date(),
        deleted_by: req.user_id
      }
    })
    const deletedPupil = await Pupil.findOneAndUpdate(
      { _id: id, deleted_at: null, school_id },
      {
        deleted_at: new Date(),
        deleted_by: req.user._id,
        updated_by: req.user._id,
      },
      { new: true },
    );


    if (!deletedPupil) {
      const err = new Error("Pupil not found or already deleted");
      err.status = 404;
      return next(err);
    }

    res
      .status(200)
      .json({ success: true, message: "Pupil deleted successfully" });
  } catch (error) {
    next(error);
  }
};
