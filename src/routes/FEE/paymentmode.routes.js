const express = require("express");
const router = express.Router();
const PaymentModeController = require('../../controllers/FEE/paymentmode.controller');

/**
 * @swagger
 * tags:
 *   name: PaymentMode
 *   description: Payment Mode management
 */

/**
 * @swagger
 * /payment-mode:
 *   post:
 *     summary: Create a new payment mode
 *     tags: [PaymentMode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_mode_name
 *             properties:
 *               payment_mode_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment mode created successfully
 *       400:
 *         description: Bad request
 */
router.post("/payment-mode/", PaymentModeController.createPaymentMode);

/**
 * @swagger
 * /payment-mode:
 *   get:
 *     summary: Get all payment modes
 *     tags: [PaymentMode]
 *     responses:
 *       200:
 *         description: A list of all payment modes.
 */
router.get("/payment-mode/", PaymentModeController.getPaymentModes);

/**
 * @swagger
 * /payment-mode/{id}:
 *   post:
 *     summary: Update a payment mode
 *     tags: [PaymentMode]
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
 *               payment_mode_name:
 *                 type: string
 *               status:
 *                 type: integer
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Payment mode updated successfully
 *       404:
 *         description: Payment mode not found
 */
router.post("/payment-mode/:id", PaymentModeController.updatePaymentMode);

/**
 * @swagger
 * /payment-mode/delete/{id}:
 *   get:
 *     summary: Delete a payment mode
 *     tags: [PaymentMode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment mode deleted successfully
 *       404:
 *         description: Payment mode not found
 */
router.get("/payment-mode/delete/:id", PaymentModeController.deletePaymentMode);

module.exports = router;
