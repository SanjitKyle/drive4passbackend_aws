const express = require('express');
const router = express.Router();
const FeePaymentController = require('../../controllers/FEE/feepayment.controller');

/**
 * @swagger
 * # components:
 * #   schemas:
 * #     FeePayment:
 * #       type: object
 * #       required:
 * #         - student_id
 * #         - admission_id
 * #         - branch_id
 * #         - installments
 * #         - totalAmount
 * #         - payment_mode_id
 * #       properties:
 * #         receiptNumber:
 * #           type: number
 * #           description: Unique receipt number for the payment
 * #         student_id:
 * #           type: string
 * #           description: ID of the student
 * #         admission_id:
 * #           type: string
 * #           description: ID of the admission
 * #         branch_id:
 * #           type: string
 * #           description: ID of the branch
 * #         installments:
 * #           type: array
 * #           items:
 * #             type: object
 * #             properties:
 * #               installment_id:
 * #                 type: string
 * #                 description: ID of the fee installment
 * #               amount:
 * #                 type: number
 * #                 description: Amount paid for this installment
 * #         totalAmount:
 * #           type: number
 * #           description: Total amount of the payment
 * #         paymentDate:
 * #           type: string
 * #           format: date-time
 * #           description: Date of the payment
 * #         payment_mode_id:
 * #           type: string
 * #           description: ID of the payment mode
 * #         transactionDetails:
 * #           type: object
 * #           additionalProperties:
 * #             type: string
 * #           description: Details of the transaction
 * #         notes:
 * #           type: string
 * #           description: Additional notes for the payment
 * #         created_by:
 * #           type: string
 * #           description: ID of the user who created the payment
 * #         updated_by:
 * #           type: string
 * #           description: ID of the user who last updated the payment
 */

// Route to create a new fee payment
router.post('/', FeePaymentController.createFeePayment);

// Route to get all fee payments
router.get('/', FeePaymentController.getAllFeePayments);

// Route to get a single fee payment by ID
router.get('/:id', FeePaymentController.getFeePaymentById);

/**
 * @swagger
 * /fee-payments/admission/{admission_id}:
 *   get:
 *     summary: Get all fee payments for a given admission ID
 *     tags: [FeePayment]
 *     parameters:
 *       - in: path
 *         name: admission_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the admission
 *     responses:
 *       200:
 *         description: A list of fee payments for the admission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FeePayment'
 *       404:
 *         description: No fee payments found for this admission
 *       500:
 *         description: Server error
 */
router.get('/fee-payments/admission/:admission_id', FeePaymentController.getFeePaymentsByAdmissionId);

module.exports = router;
