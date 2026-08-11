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
const { sendNotification } = require("./message_token_store");
const notificationToken = require("../../models/DS/fcmtokenstore");
const notificationStore = require("../../models/DS/notification_stored");
const generateInviteCode = require("../../utils/invite_code");
const { PupilInvitationMail } = require("../../utils/MailSend");

// CREATE a new pupil
exports.createPupil = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!req.user || !req.user._id) {
      throw new Error("Unauthorized");
    }

    const { full_name, phone, email, instructor_id, area_id, package_id, postcode, gearbox } =
      req.body;

    const userExists = await UserModel.findOne({ email: email }).session(session);
    if (userExists) {
      throw new Error("Email already exists.");
    }

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
          postcode,
          gearbox,
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
    const invite_code = await generateInviteCode(pupil_id);
    pupil[0].invite_code = invite_code;
    await pupil[0].save({ session }); // Missing save!

    console.log("pupil", pupil);

    // send mail to pupil for invition code 
    await PupilInvitationMail(email, pupil[0].full_name, invite_code);

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
    // const creditResult = await createPupilCredits(
    //   {
    //     pupil_id,
    //     credits: packageData.duration,
    //     reference: "sale",
    //     school_id,
    //     user: created_by,
    //   },
    //   session,
    // );

    // if (!creditResult.success) {
    //   throw new Error(creditResult.message);
    // }

    if (String(instructor_id) !== String(created_by)) {
      const userToken = await notificationToken.findOne({ user: instructor_id });
      if (userToken && userToken.token) {
        await sendNotification({
          token: userToken.token,
          title: "New Pupil Assigned",
          body: `A new pupil name: ${full_name} has been assigned to you.`,
          data: { type: "new_pupil", pupil_id: String(pupil_id) }
        });
        await notificationStore.create({
          message: `A new pupil  name :${full_name} has been assigned to you.`,
          receiver_id: instructor_id,
          sender_id: created_by,
        });
      }

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
      postcode,
      active,
      progress,
      gearbox,
    } = req.body);

    const datatosend = {
      full_name,
      phone,
      email,
      instructor_id,
      area_id,
      postcode,
      active,
      progress,
      gearbox
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
    const pupils = await Pupil.find({ deleted_at: null})
      .populate("instructor_id")
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

exports.AcceptInvitation = async (req, res, next) => {
  try {
    const { invite_code, password } = req.body;

    if (!invite_code) {
      const err = new Error("Invite code is required");
      err.status = 400;
      return next(err);
    }

    if (!password) {
      const err = new Error("Password is required");
      err.status = 400;
      return next(err);
    }

    // Find the pupil by invite code
    const pupil = await Pupil.findOne({ invite_code, deleted_at: null });

    if (!pupil) {
      const err = new Error("Invalid or expired invitation code");
      err.status = 404;
      return next(err);
    }

    // Hash the password securely
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update pupil
    pupil.password = hashedPassword;
    pupil.signup_type = true;
    pupil.invite_code = null; // Clear the invite code so it can't be reused
    pupil.active = 1; // Mark as active

    await pupil.save();

    return res.status(200).json({
      success: true,
      message: "Password set and signup completed successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.reGenerateInviteCode = async (req, res, next) => {
  try {
    const { pupil_id } = req.body;
    if (!pupil_id) {

      return res.status(400).json({ success: false, message: "pupil_id is required" });
    }

    const pupil = await Pupil.findOne({ _id: pupil_id, deleted_at: null });
    if (!pupil) {
      return res.status(404).json({ success: false, message: "Pupil not found" });
    }

    const invite_code = await generateInviteCode(pupil_id);
    pupil.invite_code = invite_code;

    await pupil.save();
    await PupilInvitationMail(pupil.email, pupil.full_name, invite_code);

    return res.status(200).json({ success: true, message: "Invite code regenerated and email sent", invite_code });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });

  }
}
