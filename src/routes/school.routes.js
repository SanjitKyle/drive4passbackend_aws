const express = require('express');
const router = express.Router();
const SchoolController = require('../controllers/school.controller');

router.post('/schools/', SchoolController.createSchool);
router.get('/schools/', SchoolController.getSchools);
router.get('/schools/:id', SchoolController.getSchoolById);
router.put('/schools/:id', SchoolController.updateSchool);
router.delete('/schools/:id', SchoolController.deleteSchool);

module.exports = router;
