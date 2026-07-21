const express = require("express");
const router = express.Router();
const LeadTaggingController = require("../../controllers/LMS/lead_tagging.controller");

router.post("/lead-taggings/:lead_id", LeadTaggingController.createLeadTagging);
router.get("/get-lead-taggings/:lead_id", LeadTaggingController.getLeadTaggings);
router.post("/update-lead-tagging/:id", LeadTaggingController.updateLeadTagging);
router.get('/delete-lead-taggings/:id', LeadTaggingController.deleteLeadTagging);

module.exports = router;
