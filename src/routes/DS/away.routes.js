const express = require('express');
const router = express.Router();
const AwayController = require('../../controllers/DS/away.controller');

/**
 * @swagger
 * tags:
 *   name: Away
 *   description: Instructor Away/Leave management
 */

/**
 * @swagger
 * /ds/away:
 *   post:
 *     summary: Create a new away entry
 *     tags: [Away]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instructor_id
 *               - start_time
 *               - end_time
 *             properties:
 *               instructor_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               start_time:
 *                 type: string
 *                 example: "09:00 AM"
 *               end_time:
 *                 type: string
 *                 example: "05:00 PM"
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Away record created successfully
 *       400:
 *         description: Bad request
 */
router.post('/away', AwayController.createAway);

/**
 * @swagger
 * /ds/away:
 *   get:
 *     summary: Get all away records
 *     tags: [Away]
 *     responses:
 *       200:
 *         description: List of away records
 */
router.get('/away', AwayController.getAllAway);

/**
 * @swagger
 * /ds/away/instructor/{instructorId}:
 *   get:
 *     summary: Get away records for a specific instructor
 *     tags: [Away]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor away records fetched successfully
 */
router.get('/away/instructor/:instructorId', AwayController.getAwayByInstructor);

/**
 * @swagger
 * /ds/away/{id}:
 *   get:
 *     summary: Get away record by ID
 *     tags: [Away]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Away record fetched successfully
 *       404:
 *         description: Away record not found
 */
router.get('/away/:id', AwayController.getAwayById);

/**
 * @swagger
 * /ds/away/{id}:
 *   post:
 *     summary: Update away record by ID
 *     tags: [Away]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instructor_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Away record updated successfully
 *       404:
 *         description: Away record not found
 */
router.post('/away/:id', AwayController.updateAway);

/**
 * @swagger
 * /ds/away/delete/{id}:
 *   post:
 *     summary: Delete away record by ID
 *     tags: [Away]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Away record deleted successfully
 *       404:
 *         description: Away record not found
 */
router.post('/away/delete/:id', AwayController.deleteAway);
router.get('/away/delete/:id', AwayController.deleteAway);

module.exports = router;
