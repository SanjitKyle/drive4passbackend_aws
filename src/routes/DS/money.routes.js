const express = require("express");
const router = express.Router();

const MoneyController = require("../../controllers/DS/money.controller");

/**
 * @swagger
 * tags:
 *   name: Money
 *   description: Money / Payment management
 */

/**
 * @swagger
 * /ds/money:
 *   post:
 *     summary: Add money record
 *     tags: [Money]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pupil_id
 *               - amount
 *             properties:
 *               pupil_id:
 *                 type: string
 *               instructor_id:
 *                 type: string
 *               payment_method:
 *                 type: string
 *                 enum: [cash, card, upi, net_banking, wallet]
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Money added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Pupil or Instructor not found
 */
router.post("/money", MoneyController.addMoney);


/**
 * @swagger
 * /ds/money/{id}:
 *   post:
 *     summary: Edit money record
 *     tags: [Money]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Money record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instructor_id:
 *                 type: string
 *               payment_method:
 *                 type: string
 *                 enum: [cash, card, upi, net_banking, wallet]
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Money updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Money record not found
 */
router.post("/money/:id", MoneyController.editMoney);

/**
 * @swagger
 * /ds/money/instructor/{id}:
 *   get:
 *     summary: Get all money records of a specific instructor
 *     tags: [Money]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
 *     responses:
 *       200:
 *         description: Money records retrieved successfully
 *       400:
 *         description: Instructor ID is required
 *       404:
 *         description: No records found
 */
router.get("/money/instructor/:id", MoneyController.getInstructorMoney);

/**
 * @swagger
 * /ds/money/pupil/{id}:
 *   get:
 *     summary: Get all money records of a specific pupil
 *     tags: [Money]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pupil ID
 *     responses:
 *       200:
 *         description: Money records retrieved successfully
 *       400:
 *         description: Pupil ID is required
 *       404:
 *         description: No records found
 */
router.get("/money/pupil/:id", MoneyController.getPupilMoney);


module.exports = router;
