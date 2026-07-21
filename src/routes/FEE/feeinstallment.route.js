const express = require("express");
const router = express.Router();

const FeeInstallmentController = require("../../controllers/FEE/feeinstallment.controller");

/**
 * @swagger
 * tags:
 *   name: FeeInstallment
 *   description: Fee Installment management
 */

/**
 * @swagger
 * /fee-installment:
 *   post:
 *     summary: Create a single fee installment
 *     tags: [FeeInstallment]
 *     description: >
 *       Creates a single fee installment with two distinct behaviors based on the `status` field.
 * 
 *       ### 1. Create a "Due" Installment:
 *       - If `status` is set to "Due" or is not provided, the endpoint will create a standard, unpaid installment.
 *       - The response will contain the newly created installment object.
 * 
 *       ### 2. Create a "Paid" Installment:
 *       - If `status` is set to "Paid", the endpoint performs a transaction to create both the installment record and its corresponding payment record.
 *       - This requires `payment_mode_id` and `payment_date` to be provided in the request.
 *       - The response will contain an object with both the new `installment` and `payment` records.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admission_id
 *               - fee_type_id
 *               - due_date
 *               - amount
 *             properties:
 *               admission_id:
 *                 type: string
 *                 description: The ID of the admission record.
 *                 example: "60d5f1a7b4854b325c8d0004"
 *               fee_type_id:
 *                 type: string
 *                 description: The ID of the fee type.
 *                 example: "60d5f1a7b4854b325c8d0005"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: The date when the installment is due.
 *                 example: "2026-08-01"
 *               last_due_date:
 *                 type: string
 *                 format: date
 *                 description: The last date for payment without a late fee.
 *                 example: "2026-08-10"
 *               amount:
 *                 type: number
 *                 description: The principal amount for the installment.
 *                 example: 1500
 *               late_fee:
 *                 type: number
 *                 description: The late fee amount, if applicable.
 *                 default: 0
 *               is_late_fee_applied:
 *                 type: boolean
 *                 description: Whether a late fee has been applied.
 *                 default: false
 *               status:
 *                 type: string
 *                 enum: [Due, Paid]
 *                 description: Set to 'Paid' to create a payment record simultaneously.
 *                 default: 'Due'
 *               payment_date:
 *                 type: string
 *                 format: date
 *                 description: "Required when status is 'Paid'. The date the payment was made."
 *                 example: "2026-08-01"
 *               payment_mode_id:
 *                 type: string
 *                 description: "Required when status is 'Paid'. The ID of the payment mode."
 *                 example: "60d5f1a7b4854b325c8d0006"
 *               transaction_id:
 *                 type: string
 *                 description: "Optional transaction ID, used if status is 'Paid'."
 *                 example: "TXN123ABC456"
 *               notes:
 *                 type: string
 *                 description: "Optional notes for the payment. Used only when status is 'Paid'."
 *                 example: "Full payment made via online transfer."
 *           examples:
 *             CreateDueInstallment:
 *               summary: Create a standard 'Due' installment
 *               value:
 *                 admission_id: "60d5f1a7b4854b325c8d0004"
 *                 fee_type_id: "60d5f1a7b4854b325c8d0005"
 *                 due_date: "2026-08-01"
 *                 last_due_date: "2026-08-10"
 *                 amount: 1500
 *                 status: "Due"
 *             CreatePaidInstallment:
 *               summary: Create a 'Paid' installment and its payment record
 *               value:
 *                 admission_id: "60d5f1a7b4854b325c8d0004"
 *                 fee_type_id: "60d5f1a7b4854b325c8d0005"
 *                 due_date: "2026-08-01"
 *                 last_due_date: "2026-08-10"
 *                 amount: 1500
 *                 status: "Paid"
 *                 payment_date: "2026-08-01"
 *                 payment_mode_id: "60d5f1a7b4854b325c8d0006"
 *                 transaction_id: "TXN123456"
 *                 notes: "Full payment made upfront."
 *     responses:
 *       '201':
 *         description: Successfully created. The response body contains the installment object if status is 'Due', or an object with the installment and payment if status is 'Paid'.
 *       '400':
 *         description: "Bad Request. Possible reasons: `payment_mode_id` or `payment_date` missing for 'Paid' status, or an invalid status value was provided."
 *       '404':
 *         description: "Not Found. The provided `admission_id` does not exist."
 *       '409':
 *         description: "Conflict. A fee installment with the same admission, fee type, and due date already exists."
 */
router.post("/fee-installment", FeeInstallmentController.createFeeInstallment);

/**
 * @swagger
 * /fee-installment/admission/{admission_id}:
 *   get:
 *     summary: Get all fee installments by admission ID
 *     tags: [FeeInstallment]
 *     parameters:
 *       - in: path
 *         name: admission_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fee installments fetched successfully for the given admission
 */
router.get("/fee-installment/admission/:admission_id", FeeInstallmentController.getFeeInstallmentsByAdmissionId);

/**
 * @swagger
 * /fee-installments-bulk:
 *   post:
 *     summary: Create bulk fee installments
 *     tags: [FeeInstallment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admission_id
 *               - fee_type_id
 *               - installments
 *             properties:
 *               admission_id:
 *                 type: string
 *               fee_type_id:
 *                 type: string
 *               installments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     due_date:
 *                       type: string
 *                       format: date
 *                     last_due_date:
 *                       type: string
 *                       format: date
 *                     amount:
 *                       type: number
 *                     late_fee:
 *                       type: number
 *     responses:
 *       201:
 *         description: Fee installments created successfully
 *       400:
 *         description: Bad request
 */
router.post("/fee-installments-bulk", FeeInstallmentController.createBulkFeeInstallments);

/**
 * @swagger
 * /fee-installment:
 *   get:
 *     summary: Get all fee installments
 *     tags: [FeeInstallment]
 *     responses:
 *       200:
 *         description: A list of all fee installments.
 */
router.get("/fee-installment", FeeInstallmentController.getFeeInstallments);

/**
 * @swagger
 * /fee-installment/{id}:
 *   get:
 *     summary: Get a fee installment by ID
 *     tags: [FeeInstallment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fee installment found
 *       404:
 *         description: Fee installment not found
 */
router.get("/fee-installment/:id", FeeInstallmentController.getFeeInstallmentById);

/**
 * @swagger
 * /fee-installment/{id}:
 *   post:
 *     summary: Update a fee installment
 *     tags: [FeeInstallment]
 *     description: >
 *       Updates a fee installment. Can also be used to mark an installment as 'Paid'.
 * 
 *       ### 1. Standard Update:
 *       - To update details like `due_date`, `amount`, etc., provide the fields to be changed.
 *       - Omit the `status` field or set it to 'Due'.
 * 
 *       ### 2. Mark as "Paid":
 *       - To mark an installment as paid, set `status` to "Paid".
 *       - This will create a corresponding payment record and link it to the installment.
 *       - Requires `payment_date` and `payment_mode_id`.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the fee installment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Due, Paid]
 *                 description: "The status of the installment. Changing to 'Paid' will automatically create a payment receipt."
 *               payment_mode_id:
 *                 type: string
 *                 description: "Required if updating status to 'Paid'."
 *               transaction_id:
 *                 type: string
 *                 description: "Optional transaction ID for the payment."
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *               amount:
 *                 type: number
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               last_due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Fee installment updated successfully
 *       400:
 *         description: Bad request (e.g., missing payment details for 'Paid' status)
 *       404:
 *         description: Fee installment not found
 */
router.post("/fee-installment/:id", FeeInstallmentController.updateFeeInstallment);

/**
 * @swagger
 * /fee-installment/delete/{id}:
 *   get:
 *     summary: Delete a fee installment
 *     tags: [FeeInstallment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fee installment deleted successfully
 *       404:
 *         description: Fee installment not found
 */
router.get("/fee-installment/delete/:id", FeeInstallmentController.deleteFeeInstallment);

module.exports = router;
