const express = require('express');
const router = express.Router();
const PupilController = require('../../controllers/DS/pupil.controller');

/**
 * @swagger
 * /ds/pupils/accept-invitation:
 *   post:
 *     summary: Accept pupil invitation and set password (Unauthenticated)
 *     tags: [Pupil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invite_code
 *               - password
 *             properties:
 *               invite_code:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password set and signup completed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invalid or expired invitation code
 */
router.post("/pupils/accept-invitation", PupilController.AcceptInvitation);

module.exports = router;
