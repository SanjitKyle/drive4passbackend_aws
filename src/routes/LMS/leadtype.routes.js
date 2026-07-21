const express = require("express");
const LeadTypeController = require("../../controllers/LMS/leadtype.controller");

const router = express.Router();

router.post("/leadtypes/", LeadTypeController.createLeadType);
router.get("/leadtypes/", LeadTypeController.getAllLeadTypes);
router.get("/leadtypes/:id", LeadTypeController.getLeadTypeById);
router.post("/leadtypes/:id", LeadTypeController.updateLeadType); // Update with POST
router.get("/leadtypes/delete/:id", LeadTypeController.deleteLeadType); // Delete with GET

module.exports = router;
