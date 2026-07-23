const getTotalHours = require("../../utils/timeDifferent");
const booking = require("../../models/DS/booking.model");
const instructor_masterModel = require("../../models/DS/instructor_master.model");
const pupilModel = require("../../models/DS/pupil.model");
const InstructorAvailability = require("../../models/DS/weekly_availability");
const { json } = require("express");
const { createCreditLog } = require("./pupil_credits_log.controller");
const pupilCreditLogs = require("../../models/DS/pupil_credit_logs.model");
const NotificationToken = require("../../models/DS/fcmtokenstore");
const NotificationStore = require("../../models/DS/notification_stored");
const { sendNotification } = require("./message_token_store");

exports.createBooking = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const created_by = req.user._id;

    const {
      pupil_id,
      instructor_id,
      title,
      booking_date,
      start_time,
      end_time,
      repeat,
      gearbox,
      pickup,
      dropoff,
      private_notes,
      pupil_summary,
      status,
    } = req.body;

    // =============================
    // REQUIRED FIELD VALIDATION
    // =============================
    if (
      !pupil_id ||
      !instructor_id ||
      !booking_date ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        success: false,
        message:
          "pupil_id, instructor_id, booking_date, start_time, end_time are required",
      });
    }

    // =============================
    // CHECK INSTRUCTOR
    // =============================
    const instructor = await instructor_masterModel.findById(instructor_id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // =============================
    // CHECK PUPIL
    // =============================
    const pupil = await pupilModel.findById(pupil_id).populate("package_id");

    if (!pupil) {
      return res.status(404).json({
        success: false,
        message: "Pupil not found",
      });
    }

    // =============================
    // CALCULATE BOOKING HOURS
    // =============================
    const credit_use = getTotalHours(booking_date, start_time, end_time);

    if (!credit_use || isNaN(credit_use) || credit_use <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking time range",
      });
    }

    // =============================
    // CHECK INSTRUCTOR TIME CONFLICT
    // =============================
    const bookings = await booking.find({ instructor_id });

    const isConflict = bookings.some((b) => {
      const sameDate =
        b.booking_date.toISOString().slice(0, 10) === booking_date;

      const overlap = start_time < b.end_time && end_time > b.start_time;

      return sameDate && overlap;
    });

    if (isConflict) {
      return res.status(403).json({
        success: false,
        message: "Instructor is not free at this time",
      });
    }

    // =============================
    // CALCULATE TOTAL USED CREDITS
    // =============================
    const allBookings = await booking.find({
      pupil_id,
      school_id,
    });

    const totalPreviousSpent = allBookings.reduce(
      (sum, b) => sum + (b.status !== 'cancelled' ? Number(b.credit_use) || 0 : 0),
      0,
    );
    console.log("credit-use", credit_use);

    const totalSpent =
      (totalPreviousSpent ? totalPreviousSpent : 0) + credit_use;
    console.log("totalspent", totalSpent);

    if (totalSpent > pupil?.total_credit) {
      return res.status(403).json({
        success: false,
        message: "Pupil does not have sufficient credit hours",
      });
    }

    if (instructor_id == created_by) {
      status = 'booked'
    }

    // =============================
    // CREATE BOOKING
    // =============================
    const createdBooking = await booking.create({
      school_id,
      instructor_id,
      pupil_id,
      title,
      booking_date,
      start_time,
      end_time,
      repeat,
      gearbox,
      pickup,
      dropoff,
      private_notes,
      pupil_summary,
      credit_use,
      status: status || "booking_request",
      created_by,
    });

    if (!createdBooking) {
      return res.status(500).json({
        success: false,
        message: "Booking creation failed",
      });
    }

    // =============================
    // UPDATE REMAINING HOURS IF COMPLETED
    // =============================
    if (status === "completed") {
      const remaining = pupil.remaining_hour - credit_use;
      await pupilModel.findByIdAndUpdate(
        pupil_id,
        { remaining_hour: remaining },
        { new: true },
      );

      const creditLog = await createCreditLog({
        pupil_id,
        credit_hours: -Number(credit_use),
        reference_id: createdBooking._id,
        reference: "booking",
        school_id,
        created_by,
      });

      if (!creditLog) {
        return res.status(500).json({
          success: false,
          message: "Credit log creation failed",
        });
      }
    }

    // =============================
    // SEND NOTIFICATION TO INSTRUCTOR
    // =============================
    if (String(instructor_id) !== String(created_by)) {
      const userToSendNotification = await NotificationToken.findOne({ user: instructor_id });
      if (userToSendNotification?.token) {
        let notificationBody = `A new booking request has come to you.`;
        const response = await sendNotification({
          token: userToSendNotification.token,
          title: "New Booking Request",
          body: notificationBody,
        });

        if (response) {
          await NotificationStore.create({
            message: notificationBody,
            receiver_id: instructor_id,
            sender_id: created_by,
          });
        }
      }
    }

    // =============================
    // SUCCESS RESPONSE
    // =============================
    return res.status(201).json({
      success: true,
      message: "Slot booked successfully",
      data: createdBooking,
    });
  } catch (error) {
    console.log("error:", error);
    next(error);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const instructor_id = req.params.id;
    const school_id = req.user.school_id;

    if (!instructor_id) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID is required",
      });
    }

    const bookings = await booking
      .find({
        instructor_id,
        school_id,
        deleted_at: null,
      })
      .populate("pupil_id")
      .populate("instructor_id");
    const bookingsData = bookings.filter(
      (b) => b.pupil_id !== null
    );

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookingsData,
    });
  } catch (error) {
    console.error("Get Booking Error:", error);
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;

    const bookings = await booking
      .find({
        school_id,
        deleted_at: null,
      })
      .populate("pupil_id")
      .populate("instructor_id");
    const bookingsData = bookings.filter(
      (b) => b.pupil_id !== null
    );
    return res.status(200).json(bookingsData);
  } catch (error) {
    console.log("Get All Booking Error:", error);
    next(error);
  }
};
exports.updateBooking = async (req, res, next) => {
  try {
    const booking_id = req.params.id;
    const school_id = req.user.school_id;

    const existingBooking = await booking.findOne({
      _id: booking_id,
      school_id,
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const allowedFields = [
      "title",
      "instructor_id",
      "pupil_id",
      "booking_date",
      "start_time",
      "end_time",
      "repeat",
      "gearbox",
      "pickup",
      "dropoff",
      "private_notes",
      "pupil_summary",
      "payment_type",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    let newCreditUse = existingBooking.credit_use;

    // Recalculate only if time/date changes
    if (
      updateData.booking_date ||
      updateData.start_time ||
      updateData.end_time
    ) {
      const booking_date =
        updateData.booking_date || existingBooking.booking_date;

      const start_time =
        updateData.start_time || existingBooking.start_time;

      const end_time =
        updateData.end_time || existingBooking.end_time;

      newCreditUse = getTotalHours(
        booking_date,
        start_time,
        end_time
      );

      if (newCreditUse <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid time range",
        });
      }

      updateData.credit_use = newCreditUse;
    }

    // Update pupil credits only if the booking was already completed
    if (newCreditUse !== existingBooking.credit_use && existingBooking.status === "completed") {
      const pupilProfile = await pupilModel.findById(
        existingBooking.pupil_id
      );

      if (pupilProfile) {
        pupilProfile.remaining_hour =
          pupilProfile.remaining_hour +
          existingBooking.credit_use -
          newCreditUse;

        await pupilProfile.save();
      }

      // Update credit log
      await pupilCreditLogs.findOneAndUpdate(
        { reference_id: existingBooking._id },
        { credit_hours: -Number(newCreditUse) },
        { new: true }
      );
    }

    const updatedBooking = await booking.findOneAndUpdate(
      { _id: booking_id, school_id },
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.log("Update Booking Error:", error);
    next(error);
  }
};
exports.getPupilsBookings = async (req, res, next) => {
  try {
    const pupil_id = req.params.pupil_id;
    const school_id = req.user.school_id; // from auth middleware

    if (!pupil_id) {
      return res.status(400).json({
        success: false,
        message: "Pupil ID is required",
      });
    }

    const bookings = await booking
      .find({
        pupil_id,
        school_id,
        deleted_at: null // ✅ secure verification
      })
      .populate("instructor_id", "name email mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pupil bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Get Pupil Bookings Error:", error);
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking_id = req.params.id;
    const school_id = req.user.school_id;
    const created_by = req.user._id;
    console.log('calling....')

    const allowedStatus = [
      "booking_request",
      "pending",
      "booked",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }
    console.log('sateu', status)
    const getbook = await booking.findById({ _id: booking_id }).populate("pupil_id");
    if (!getbook) {
      return res.status(404).json({
        message: 'Booking could not found with this id ',
        sucess: false
      })
    }
    if (getbook.status === 'cancelled') {
      return res.status(403).json({
        message: "Booking is already cancelled",
        sucess: false
      })
    }

    if (status === "completed" && getbook.status !== "completed") {
      const remaining = getbook.pupil_id.remaining_hour - getbook.credit_use;
      await pupilModel.findByIdAndUpdate(getbook.pupil_id._id, {
        remaining_hour: remaining,
      });
      await createCreditLog({
        pupil_id: getbook.pupil_id._id,
        credit_hours: -Number(getbook.credit_use),
        reference_id: getbook._id,
        reference: "booking",
        school_id,
        created_by,
      });
    } else if (status === "cancelled" && getbook.status === "completed") {
      console.log('inside')
      const remaining =
        getbook.pupil_id.remaining_hour + getbook.credit_use;

      await pupilModel.findByIdAndUpdate(getbook.pupil_id._id, {
        remaining_hour: remaining,
      });
      const pupil_id = getbook.pupil_id._id;
      const createdlog = await createCreditLog({
        pupil_id,
        credit_hours: Number(getbook.credit_use),
        reference_id: getbook._id,
        reference: "booking",
        school_id,
        created_by,
      });
    }
    const updated = await booking.findOneAndUpdate(
      { _id: booking_id, school_id },
      { $set: { status } },
      { new: true },
    );



    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("Status Update Error:", error);
    next(error);
  }
};
