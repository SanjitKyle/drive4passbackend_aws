const InstructorWorkingDay = require("../../models/DS/instructor_working_day.model");
const Instructor = require("../../models/DS/instructor_master.model");

/**
 * Initialize or Reset 7-day schedule to defaults
 */
// exports.initializeWeeklySchedule = async (req, res, next) => {
//   try {
//     const { instructor_id } = req.body;
//     const school_id = req.user.school_id;

//     if (!instructor_id) return res.status(400).json({ success: false, message: "instructor_id is required" });

//     const instructor = await Instructor.findOne({ _id: instructor_id, school_id });
//     if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found" });

//     const bulkOps = [];
//     for (let day = 1; day <= 7; day++) {
//       const isWorking = day <= 5; // Mon-Fri default
//       bulkOps.push({
//         updateOne: {
//           filter: { school_id, instructor_id, day_of_week: day },
//           update: {
//             $setOnInsert: { school_id, instructor_id, day_of_week: day },
//             $set: { is_working: isWorking ? 1 : 0, start_time: isWorking ? "09:00" : null, end_time: isWorking ? "17:00" : null, break_start: null, break_end: null }
//           },
//           upsert: true
//         }
//       });
//     }

//     await InstructorWorkingDay.bulkWrite(bulkOps);

//     res.status(200).json({ success: true, message: "Instructor weekly schedule initialized successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * Create/Update full weekly schedule (bulk)
 */
exports.upsertWeeklySchedule = async (req, res, next) => {
  try {
    const { instructor_id, workingDays } = req.body;
    const school_id = req.user.school_id;

    if (!instructor_id || !workingDays) return res.status(400).json({ success: false, message: "instructor_id and workingDays are required" });

    const instructor = await Instructor.findOne({ _id: instructor_id, school_id });
    if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found" });

    const bulkOps = [];
    Object.entries(workingDays).forEach(([day, data]) => {
  
      bulkOps.push({
        updateOne: {
          filter: { school_id, instructor_id, day_of_week: Number(day) },
          update: {
            $setOnInsert: { school_id, instructor_id, day_of_week: Number(day) },
            $set: { is_working: data.is_working ? 1 : 0, start_time: data.is_working ? data.workStart : null, end_time: data.is_working ? data.workEnd : null, break_start: data.breakStart || null, break_end: data.breakEnd || null }
          },
          upsert: true
        }
      });
    });

    await InstructorWorkingDay.bulkWrite(bulkOps);

    res.status(200).json({ success: true, message: "Weekly schedule created/updated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Create/Update a single day
 */
exports.setInstructorWorkingDay = async (req, res, next) => {
  try {
    const { instructor_id, day_of_week, is_working, start_time, end_time, break_start, break_end } = req.body;
    const school_id = req.user.school_id;

    if (!instructor_id || !day_of_week) return res.status(400).json({ success: false, message: "Instructor and day_of_week are required" });
    if (day_of_week < 1 || day_of_week > 7) return res.status(400).json({ success: false, message: "day_of_week must be between 1 and 7" });

    const instructor = await Instructor.findOne({ _id: instructor_id, school_id });
    if (!instructor) return res.status(404).json({ success: false, message: "Instructor not found or unauthorized" });

    const record = await InstructorWorkingDay.findOneAndUpdate(
      { school_id, instructor_id, day_of_week },
      { $set: { is_working: is_working ?? 1, start_time: start_time || null, end_time: end_time || null, break_start: break_start || null, break_end: break_end || null } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Instructor working day saved", data: record });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all working days (array)
 */
exports.getInstructorWorkingDays = async (req, res, next) => {
  try {
    const { instructor_id } = req.params;
    const school_id = req.user.school_id;

    const days = await InstructorWorkingDay.find({ school_id, instructor_id }).sort({ day_of_week: 1 });
    return res.status(200).json({ success: true, data: days });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all working days (frontend object)
 */
// exports.getWeeklySchedule = async (req, res, next) => {
//   try {
//     const { instructor_id } = req.params;
//     const school_id = req.user.school_id;

//     const days = await InstructorWorkingDay.find({ instructor_id, school_id }).sort({ day_of_week: 1 });

//     const schedule = {};
//     days.forEach(day => {
//       schedule[day.day_of_week] = { enabled: day.is_working === 1, workStart: day.start_time, workEnd: day.end_time, breakStart: day.break_start, breakEnd: day.break_end };
//     });

//     res.status(200).json({ success: true, data: schedule });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * Get single day's schedule
 */
exports.GetSingleDayData = async (req, res, next) => {
  try {
    const { instructor_id, day } = req.params;
    const school_id = req.user.school_id;
    const dayNumber = Number(day);

    if (dayNumber < 1 || dayNumber > 7) return res.status(400).json({ success: false, message: "day must be between 1 and 7" });

    const workingDay = await InstructorWorkingDay.findOne({ instructor_id, school_id, day_of_week: dayNumber });
    if (!workingDay) return res.status(404).json({ success: false, message: "Schedule not found for this day" });

    res.status(200).json({
      success: true,
      message: 'Got data successfully',
      data: { day: dayNumber, enabled: workingDay.is_working === 1, workStart: workingDay.start_time, workEnd: workingDay.end_time, breakStart: workingDay.break_start, breakEnd: workingDay.break_end }
    });
  } catch (error) {
    next(error);
  }
};
