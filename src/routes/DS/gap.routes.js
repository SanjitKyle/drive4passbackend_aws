const express = require('express');
const router = express.Router();
const GapController = require('../../controllers/DS/gap');

/**
 * @swagger
 * tags:
 *   name: Gap
 *   description: Gap schedule management
 */

/**
 * @swagger
 * /ds/gaps:
 *   post:
 *     summary: Create a new gap
 *     tags: [Gap]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 example: "10:00 AM"
 *               duration_hours:
 *                 type: number
 *                 example: 1
 *               duration_minutes:
 *                 type: number
 *                 example: 30
 *               duration:
 *                 description: "Can be passed as hours (e.g. 1.5), hours and minutes string ('1 hour 30 mins' or '1:30'), or number of hours."
 *                 type: string
 *                 example: "1 hour 30 mins"
 *               instructor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gap created successfully
 *       400:
 *         description: Bad request
 */
router.post('/gaps', GapController.createGap);

/**
 * @swagger
 * /ds/gaps:
 *   get:
 *     summary: Get all gaps
 *     tags: [Gap]
 *     responses:
 *       200:
 *         description: List of gaps
 */
router.get('/gaps', GapController.getAllGaps);

/**
 * @swagger
 * /ds/gaps/instructor/{instructorId}:
 *   get:
 *     summary: Get gaps for a specific instructor
 *     tags: [Gap]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor gaps fetched successfully
 */
router.get('/gaps/instructor/:instructorId', GapController.getGapsByInstructor);

/**
 * @swagger
 * /ds/gaps/{id}:
 *   get:
 *     summary: Get gap by ID
 *     tags: [Gap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gap fetched successfully
 *       404:
 *         description: Gap not found
 */
router.get('/gaps/:id', GapController.getGapById);

/**
 * @swagger
 * /ds/gaps/{id}:
 *   post:
 *     summary: Update gap by ID
 *     tags: [Gap]
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
 *               date:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 example: "10:00 AM"
 *               duration_hours:
 *                 type: number
 *               duration_minutes:
 *                 type: number
 *               duration:
 *                 type: string
 *               instructor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gap updated successfully
 *       404:
 *         description: Gap not found
 */
router.post('/gaps/:id', GapController.updateGap);

/**
 * @swagger
 * /ds/gaps/delete/{id}:
 *   post:
 *     summary: Delete gap by ID
 *     tags: [Gap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gap deleted successfully
 *       404:
 *         description: Gap not found
 */
router.post('/gaps/delete/:id', GapController.deleteGap);
router.get('/gaps/delete/:id', GapController.deleteGap);

/**
 * @swagger
 * /ds/gaps/convert-to-booking/{id}:
 *   post:
 *     summary: Convert a gap entry into a booking
 *     tags: [Gap]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gap ID to convert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pupil_id
 *             properties:
 *               pupil_id:
 *                 type: string
 *               instructor_id:
 *                 type: string
 *               title:
 *                 type: string
 *               booking_date:
 *                 type: string
 *                 example: "2026-08-01"
 *               start_time:
 *                 type: string
 *                 example: "10:00 AM"
 *               end_time:
 *                 type: string
 *                 example: "11:30 AM"
 *               repeat:
 *                 type: string
 *                 enum: [repeat, norepeat]
 *               gearbox:
 *                 type: string
 *                 enum: [manual, automatic]
 *               pickup:
 *                 type: string
 *               dropoff:
 *                 type: string
 *               private_notes:
 *                 type: string
 *               pupil_summary:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [booking_request, pending, booked, completed, cancelled]
 *               sell_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gap converted to booking successfully
 *       400:
 *         description: Missing fields or invalid time range
 *       403:
 *         description: Time conflict or insufficient credits
 *       404:
 *         description: Gap, pupil, or instructor not found
 */
router.post('/gaps/convert-to-booking/:id', GapController.convertGapToBooking);

module.exports = router;
