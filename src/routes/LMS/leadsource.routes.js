const express = require("express");
const router = express.Router();
const leadSourceController = require("../../controllers/LMS/leadsource.controller");

// CRUD Routes
router.post("/leadsources", leadSourceController.createLeadSource);
router.get("/leadsources", leadSourceController.getLeadSources);
router.post("/leadsources/:id", leadSourceController.updateLeadSource);
router.get("/leadsources/delete/:id", leadSourceController.deleteLeadSource);

module.exports = router;
