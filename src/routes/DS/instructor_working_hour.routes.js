const express = require("express");
const router = express.Router();
const controller = require("../../controllers/DS/instructor_working_hour.controller");
const auth = require("../../middleware/auth.middleware");



/*****
 * 
 * 
 * just commenting it if we need then we will work on this 
 */

// router.post(
//   "/instructor-working-hours",
 
//   controller.setInstructorWorkingHours
// );

// router.get(
//   "/instructor-working-hours/:instructor_id",

//   controller.getInstructorWorkingHours
// );





module.exports = router;
