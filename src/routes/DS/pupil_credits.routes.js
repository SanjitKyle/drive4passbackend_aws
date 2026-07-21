const express = require('express');
const router = express.Router();

const {
  createPupilCredits,
  getPupil
} = require('../../controllers/DS/pupil_credits_controller');

// 🔐 Auth middleware (adjust path if needed)
const auth = require('../../middleware/auth.middleware');

router.post('/pupil-credits',  createPupilCredits);


router.get('/pupil-credits/:id',  getPupil);

module.exports = router;