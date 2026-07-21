const express = require("express");
const router = express.Router();

const {
  createLog,
  getLogs,
  getLogById,
  deleteLog,
  getLogsByUser,
  getLogsByEnquireId
} = require("../../controllers/DS/logs");


/**
 * @swagger
 * tags:
 *   name: Activity Logs
 *   description: Activity Logs Management APIs
 */

/**
 * @swagger
 * /ds/logs:
 *   post:
 *     summary: Create a new activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activity
 *             properties:
 *               activity:
 *                 type: string
 *                 example: Created a new enquiry
 *     responses:
 *       201:
 *         description: Log created successfully
 *       400:
 *         description: Activity is required
 *       500:
 *         description: Server error
 */
router.post("/logs",  createLog);

/**
 * @swagger
 * /ds/logs:
 *   get:
 *     summary: Get all activity logs for the current school
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *       500:
 *         description: Server error
 */
router.get("/logs",  getLogs);

/**
 * @swagger
 * /ds/logs/user:
 *   get:
 *     summary: Get all logs created by a specific user
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: created_by
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 6845c5c1a123456789abcdef
 *     responses:
 *       200:
 *         description: User logs fetched successfully
 *       404:
 *         description: No logs found for this user
 *       500:
 *         description: Server error
 */
router.get("/logs/user", getLogsByUser);

/**
 * @swagger
 *  /ds/logs/{id}:
 *   get:
 *     summary: Get a single activity log by ID
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log ID
 *         example: 6845c5c1a123456789abcdef
 *     responses:
 *       200:
 *         description: Log fetched successfully
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 */
router.get("/logs/:id",  getLogById);

/**
 * @swagger
 *  /ds/logs/{id}:
 *   delete:
 *     summary: Delete an activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Log ID
 *         example: 6845c5c1a123456789abcdef
 *     responses:
 *       200:
 *         description: Log deleted successfully
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 */
router.delete("/logs/:id",deleteLog);

/**
 * @swagger
 * /ds/logs/enquire/{enquire_id}:
 *   get:
 *     summary: Get activity logs by enquire ID
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enquire_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enquire ID
 *         example: 6845c5c1a123456789abcdef
 *     responses:
 *       200:
 *         description: Activity logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No logs found for this enquire
 *       500:
 *         description: Server error
 */
router.get("/logs/enquire/:enquire_id", getLogsByEnquireId);

module.exports = router;