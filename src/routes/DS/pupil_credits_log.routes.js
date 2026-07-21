const express = require("express");
const router = express.Router();

const {
  createCreditLog,
  getLogsByPupil,
} = require("../../controllers/DS/pupil_credits_log.controller");

const auth = require("../../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Pupil Credit Logs
 *   description: Pupil credit log management
 */

/**
 * @swagger
 * /ds/pupil-credit-logs:
 *   post:
 *     summary: Create a pupil credit log
 *     tags: [Pupil Credit Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pupil_id
 *               - credit_hours
 *               - reference
 *               - school_id
 *             properties:
 *               pupil_id:
 *                 type: string
 *                 description: ID of the pupil
 *               credit_hours:
 *                 type: number
 *                 description: Number of credit hours added or deducted
 *               reference:
 *                 type: string
 *                 description: Source of credit (e.g. sale, booking)
 *               school_id:
 *                 type: string
 *                 description: School ID
 *               created_by:
 *                 type: string
 *                 description: User who created the log
 *     responses:
 *       201:
 *         description: Credit log created successfully
 *       400:
 *         description: Bad request
 */
router.post("/pupil-credit-logs", createCreditLog);

/**
 * @swagger
 * /ds/pupil-credit-logs/{id}:
 *   get:
 *     summary: Get credit logs by pupil ID
 *     tags: [Pupil Credit Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Pupil ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of credit logs for the pupil
 *       404:
 *         description: Logs not found
 */
router.get("/pupil-credit-logs/:id", getLogsByPupil);

module.exports = router;
