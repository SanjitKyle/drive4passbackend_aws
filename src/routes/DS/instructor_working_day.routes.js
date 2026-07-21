const express = require('express');
const router = express.Router();
const WorkingDayController = require('../../controllers/DS/instructor_working_day.controller');

/**
 * @swagger
 * tags:
 *   name: InstructorWorkingDay
 *   description: Instructor Working Day management
 */

/**
 * @swagger
 * /ds/instructor-working-days/upsert:
 *   post:
 *     summary: Create or update the full weekly schedule for an instructor
 *     tags: [InstructorWorkingDay]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instructor_id
 *               - workingDays
 *             properties:
 *               instructor_id:
 *                 type: string
 *                 description: The ID of the instructor
 *               workingDays:
 *                 type: object
 *                 description: An object representing the working days of the week
 *                 example:
 *                   "1": { "is_working": true, "workStart": "09:00", "workEnd": "17:00", "breakStart": "13:00", "breakEnd": "14:00" }
 *                   "2": { "is_working": true, "workStart": "09:00", "workEnd": "17:00", "breakStart": "13:00", "breakEnd": "14:00" }
 *                   "3": { "is_working": false }
 *     responses:
 *       200:
 *         description: Weekly schedule created/updated successfully
 *       400:
 *         description: Bad request, missing required fields
 *       404:
 *         description: Instructor not found
 */
router.post(
  "/instructor-working-days/upsert",
  WorkingDayController.upsertWeeklySchedule
);

/**
 * @swagger
 * /ds/instructor-working-days/{instructor_id}:
 *   get:
 *     summary: Get all working days for an instructor
 *     tags: [InstructorWorkingDay]
 *     parameters:
 *       - in: path
 *         name: instructor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the instructor
 *     responses:
 *       200:
 *         description: A list of working days for the instructor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day_of_week:
 *                         type: number
 *                       is_working:
 *                         type: number
 *                       start_time:
 *                         type: string
 *                       end_time:
 *                         type: string
 *                       break_start:
 *                         type: string
 *                       break_end:
 *                         type: string
 *       404:
 *         description: Instructor not found
 */
router.get(
  "/instructor-working-days/:instructor_id",
  WorkingDayController.getInstructorWorkingDays
);

// 3️⃣ Set (create or update) a **single working day**
// router.post(
//   "/instructor-working-days/set-day",
  
//   WorkingDayController.setInstructorWorkingDay
// );

// router.get("/instructor-working-days/weekly/:instructor_id/:day", WorkingDayController.GetSingleDayData);

// // 5️⃣ Get **single day's schedule**
// router.get(
//   "/instructor-working-days/weekly/:instructor_id/:day",

//   WorkingDayController.GetSingleDayData
// );

module.exports = router;
