const express = require("express");
const router = express.Router();

const InstituteController = require("../../controllers/LMS/institute.controller");

router.post("/institutes", InstituteController.createInstitute);
router.get("/institutes", InstituteController.getInstitutes);
router.get("/institutes/:id", InstituteController.getInstituteById);
router.post("/institutes/:id", InstituteController.updateInstitute);
router.get("/institutes/delete/:id", InstituteController.deleteInstitute);

module.exports = router;
