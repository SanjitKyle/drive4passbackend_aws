const express = require("express");
const router = express.Router();
const LeadStatusController = require("../../controllers/LMS/leadstatus.controller");

router.post("/leadstatuses/", LeadStatusController.createLeadStatus);
router.get("/leadstatuses/", LeadStatusController.getAllLeadStatus);
router.post("/leadstatuses/:id", LeadStatusController.updateLeadStatus);
router.get("/leadstatuses/delete/:id", LeadStatusController.deleteLeadStatus);

module.exports = router;
