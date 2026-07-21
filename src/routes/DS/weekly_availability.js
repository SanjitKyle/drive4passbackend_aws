const express = require("express");
const router = express.Router();
const instructorAvailabilityController = require("../../controllers/DS/working_availability");

// Create or Update
router.post("/instructor-masters/weekly/:instructorId", instructorAvailabilityController.createOrUpdateAvailability);

// Get
router.get("/instructor-masters/weekly/:instructorId", instructorAvailabilityController.getAvailability);

module.exports = router;
