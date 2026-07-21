const express = require("express");
const router = express.Router();

const TransferController = require("../../controllers/DS/transfer.controller");

/**
 * @swagger
 * tags:
 *   name: Transfer
 *   description: Pupil transfer management
 */

/**
 * @swagger
 * /ds/transfers:
 *   post:
 *     summary: Create a new pupil transfer
 *     tags: [Transfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pupil_id
 *               - transfer_from
 *               - transfer_to
 *               - reason
 *             properties:
 *               pupil_id:
 *                 type: string
 *                 example: "6859b6f3a5d4b1f6c1234567"
 *               transfer_from:
 *                 type: string
 *                 example: "6859b712a5d4b1f6c1234568"
 *               transfer_to:
 *                 type: string
 *                 example: "6859b735a5d4b1f6c1234569"
 *               reason:
 *                 type: string
 *                 example: "Instructor unavailable on weekends"
 *
 *     responses:
 *       201:
 *         description: Transfer created successfully
 *       400:
 *         description: Bad request
 */
router.post("/transfers", TransferController.createTransfer);

/**
 * @swagger
 * /ds/transfers:
 *   get:
 *     summary: Get all transfers
 *     tags: [Transfer]
 *     responses:
 *       200:
 *         description: List of transfers
 */
router.get("/transfers", TransferController.getTransfers);

/**
 * @swagger
 * /ds/transfers/instructor/{id}:
 *   get:
 *     summary: Get all transferred pupils for a specific instructor
 *     tags: [Transfer]
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
 *         description: Successfully fetched transferred pupils
 *       404:
 *         description: No transferred pupils found for this instructor
 *       500:
 *         description: Internal server error
 */
router.get(
    "/transfers/instructor/:id",
    TransferController.getTransferPupilByInstructorId
);

/**
 * @swagger
 * /ds/transfers/{id}:
 *   get:
 *     summary: Get a transfer by ID
 *     tags: [Transfer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transfer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched transfer
 *       400:
 *         description: Invalid transfer ID
 *       404:
 *         description: Transfer not found
 *       500:
 *         description: Internal server error
 */
router.get("/transfers/:id", TransferController.getTransferById);

/**
 * @swagger
 * /ds/transfers/{id}:
 *   post:
 *     summary: Edit a transfer
 *     tags: [Transfer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transfer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pupil_id:
 *                 type: string
 *                 example: "6859b6f3a5d4b1f6c1234567"
 *               transfer_from:
 *                 type: string
 *                 example: "6859b712a5d4b1f6c1234568"
 *               transfer_to:
 *                 type: string
 *                 example: "6859b735a5d4b1f6c1234569"
 *               reason:
 *                 type: string
 *                 example: "Updated reason for transfer"
 *     responses:
 *       201:
 *         description: Transfer updated successfully
 *       401:
 *         description: Transfer not edited
 *       501:
 *         description: Internal server error
 */
router.post("/transfers/:id", TransferController.EditTransfer);

/**
 * @swagger
 * /ds/transfers/delete/{id}:
 *   get:
 *     summary: Delete a transfer
 *     tags: [Transfer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Transfer ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Transfer deleted successfully
 *       404:
 *         description: Transfer not found or already deleted
 *       501:
 *         description: Internal server error
 */
router.get("/transfers/delete/:id", TransferController.deleteTransfer);

module.exports = router;
