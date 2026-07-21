const express = require('express');
const router = express.Router();
const franchiseFeesController = require('../../controllers/DS/franchise_fees.controller');

/**
 * @swagger
 * tags:
 *   name: FranchiseFees
 *   description: Franchise Fees Payment management
 */

/**
 * @swagger
 * /ds/franchise-fees:
 *   post:
 *     summary: Create a new franchise fees payment
 *     tags: [FranchiseFees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fees_type
 *               - instructor
 *               - fees_amount
 *             properties:
 *               fees_type:
 *                 type: string
 *                 example: "Monthly"
 *               instructor:
 *                 type: string
 *                 example: "6859b735a5d4b1f6c1234569"
 *               fees_amount:
 *                 type: number
 *                 example: 500
 *               due_rule:
 *                 type: string
 *                 example: "1st of every month"
 *               custom_rule:
 *                 type: string
 *                 example: "None"
 *               action_type:
 *                 type: string
 *                 example: "payment setting"
 *     responses:
 *       200:
 *         description: Successfully add money
 *       501:
 *         description: Internal server error
 */
router.post('/franchise-fees', franchiseFeesController.AddMoney);

/**
 * @swagger
 * /ds/franchise-fees:
 *   get:
 *     summary: Get all franchise fees payment records
 *     tags: [FranchiseFees]
 *     responses:
 *       200:
 *         description: Successfully get franchise fees payment records
 *       404:
 *         description: Could not get any franchise fees payment
 *       501:
 *         description: Internal server error
 */
router.get('/franchise-fees', franchiseFeesController.GetAllRecords);

/**
 * @swagger
 * /ds/franchise-fees/instructor/{id}:
 *   get:
 *     summary: Get franchise fees payment record by instructor ID
 *     tags: [FranchiseFees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Instructor ID
 *         schema:
 *           type: string
 *           example: "6859b735a5d4b1f6c1234569"
 *     responses:
 *       200:
 *         description: Successfully get all fees payment record
 *       404:
 *         description: Could not found any franchise fees payment record
 *       501:
 *         description: Internal server error
 */
router.get('/franchise-fees/instructor/:id', franchiseFeesController.GetMoneyByInstructor);

/**
 * @swagger
 * /ds/franchise-fees/{id}:
 *   post:
 *     summary: Delete franchise fees payment record by ID
 *     tags: [FranchiseFees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment Record ID
 *         schema:
 *           type: string
 *           example: "6859b735a5d4b1f6c1234569"
 *     responses:
 *       200:
 *         description: Successfully delete payment record
 *       403:
 *         description: Could not delete payment record
 *       501:
 *         description: Internal server error
 */
router.post('/franchise-fees/:id', franchiseFeesController.DeletePayment);

module.exports = router;
