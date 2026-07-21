const InstructorWorkingHour = require("../../models/DS/instructor_working_hour.model");
const Instructor = require("../../models/DS/instructor_master.model");

/** Convert HH:mm → minutes */
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/** Validate HH:mm format */
const isValidTime = (time) =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

/**
 * CREATE / UPDATE working hours (UPSERT)
 */
exports.setInstructorWorkingHours = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const {
      instructor_id,
      day_of_week,
      start_time,
      end_time,
      break_start,
      break_end,
    } = req.body;

    /** Required fields */
    if (!instructor_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "Instructor, day_of_week, start_time, end_time are required",
      });
    }

    if (day_of_week < 1 || day_of_week > 7) {
      return res.status(400).json({
        success: false,
        message: "day_of_week must be between 1 and 7",
      });
    }

    /** Time format validation */
    for (const t of [start_time, end_time, break_start, break_end]) {
      if (t && !isValidTime(t)) {
        return res.status(400).json({
          success: false,
          message: "Time must be in HH:mm format",
        });
      }
    }

    /** Logical time validation */
    const start = toMinutes(start_time);
    const end = toMinutes(end_time);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "end_time must be greater than start_time",
      });
    }

    if (break_start && break_end) {
      const bStart = toMinutes(break_start);
      const bEnd = toMinutes(break_end);

      if (bStart >= bEnd) {
        return res.status(400).json({
          success: false,
          message: "break_end must be greater than break_start",
        });
      }

      if (bStart < start || bEnd > end) {
        return res.status(400).json({
          success: false,
          message: "Break must be within working hours",
        });
      }
    }

    /** 🔒 Instructor validation */
    const instructor = await Instructor.findOne({
      _id: instructor_id,
      school_id,
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found or unauthorized",
      });
    }

    const record = await InstructorWorkingHour.findOneAndUpdate(
      { school_id, instructor_id, day_of_week },
      {
        $set: {
          start_time,
          end_time,
          break_start: break_start || null,
          break_end: break_end || null,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Instructor working hours saved",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET instructor working hours
 */
exports.getInstructorWorkingHours = async (req, res, next) => {
  try {
    const school_id = req.user.school_id;
    const instructor_id = req.params.instructor_id;
    const { day_of_week } = req.query; // 👈 receive day

    const query = {
      school_id,
      instructor_id,
    };

    // 👇 filter by day if provided
    if (day_of_week) {
      query.day_of_week = Number(day_of_week);
    }

    const hours = await InstructorWorkingHour.find(query).sort({
      start_time: 1,
    });

    return res.status(200).json({
      success: true,
      data: hours,
    });
  } catch (error) {
    next(error);
  }
};
