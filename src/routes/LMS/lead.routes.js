const express = require("express");
const router = express.Router();
const LeadController = require("../../controllers/LMS/lead.controller");

router.post("/leads/pushLeads", LeadController.pushLeads);
router.post("/leads/bulk-upload", LeadController.bulkUploadLeads);
router.post("/leads/", LeadController.createLead);
router.get("/leads/", LeadController.getLeads);
router.post("/leads/search", LeadController.searchLeads);
router.post("/leads/search-dashboard-leads", LeadController.searchDashboardLeads);
router.get("/leads/:id", LeadController.getLeadById);
router.post("/leads/:id", LeadController.updateLead); // update
router.get("/leads/delete/:id", LeadController.deleteLead); // delete

module.exports = router;

