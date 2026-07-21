const express = require('express');
const router = express.Router();
const controller = require('../../controllers/DS/pdi_fees_amount.controller');

/**
 * @swagger
 * tags:
 *   name: PdiFeesAmount
 *   description: PDI Fees Amount management
 */

/**
 * @swagger
 * /ds/pdi-fees-amount:
 *   post:
 *     summary: Create or update PDI fees amount
 *     tags: [PdiFeesAmount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instructor
 *             properties:
 *               instructor:
 *                 type: string
 *                 description: Instructor ID
 *               fees_amount:
 *                 type: number
 *               amount_paid:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated or created PDI payment
 *       401:
 *         description: Could not update or create
 *       501:
 *         description: Internal server error
 */
router.post('/pdi-fees-amount', controller.create_fees_amount);

/**
 * @swagger
 * /ds/pdi-fees-amount:
 *   get:
 *     summary: Get all PDI fees amounts
 *     tags: [PdiFeesAmount]
 *     responses:
 *       200:
 *         description: Successfully fetched all records
 *       500:
 *         description: Internal server error
 */
router.get('/pdi-fees-amount', controller.get_all_fees_amount);

/**
 * @swagger
 * /ds/pdi-fees-amount/{id}:
 *   get:
 *     summary: Get a PDI fees amount by ID
 *     tags: [PdiFeesAmount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched record
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
router.get('/pdi-fees-amount/:id', controller.get_fees_amount_by_id);

/**
 * @swagger
 * /ds/pdi-fees-amount/instructor/{instructorId}:
 *   get:
 *     summary: Get a PDI fees amount by instructor ID
 *     tags: [PdiFeesAmount]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         description: Instructor ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched record
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
router.get('/pdi-fees-amount/instructor/:instructorId', controller.get_fees_amount_by_instructor_id);

/**
 * @swagger
 * /ds/pdi-fees-amount/{id}:
 *   delete:
 *     summary: Delete a PDI fees amount
 *     tags: [PdiFeesAmount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Record ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
router.delete('/pdi-fees-amount/:id', controller.delete_fees_amount);

module.exports = router;
