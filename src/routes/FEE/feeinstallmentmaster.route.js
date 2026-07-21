const express = require("express");
const router = express.Router();
const FeeInstallmentMasterController = require("../../controllers/FEE/feeinstallmentmaster.controller");

/**
 * @swagger
 * tags:
 *   name: FeeInstallmentMaster
 *   description: Fee Installment Master management
 */

/**
 * @swagger
 * /fee-installment-master:
 *   post:
 *     summary: Create a new fee installment master
 *     tags: [FeeInstallmentMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fee_type_id
 *               - installment_name
 *               - due_date
 *             properties:
 *               fee_type_id:
 *                 type: string
 *               installment_name:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Fee installment master created successfully
 *       400:
 *         description: Bad request
 */
router.post("/fee-installment-master/", FeeInstallmentMasterController.createFeeInstallmentMaster);

/**
 * @swagger
 * /fee-installment-master:
 *   get:
 *     summary: Get all fee installment masters
 *     tags: [FeeInstallmentMaster]
 *     responses:
 *       200:
 *         description: A list of all fee installment masters.
 */
router.get("/fee-installment-master/", FeeInstallmentMasterController.getFeeInstallmentMasters);

/**
 * @swagger
 * /fee-installment-master/{id}:
 *   get:
 *     summary: Get a fee installment master by ID
 *     tags: [FeeInstallmentMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fee installment master found
 *       404:
 *         description: Fee installment master not found
 */
router.get("/fee-installment-master/:id", FeeInstallmentMasterController.getFeeInstallmentMasterById);

/**
 * @swagger
 * /fee-installment-master/{id}:
 *   post:
 *     summary: Update a fee installment master
 *     tags: [FeeInstallmentMaster]
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
 *               fee_type_id:
 *                 type: string
 *               installment_name:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: integer
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Fee installment master updated successfully
 *       404:
 *         description: Fee installment master not found
 */
router.post("/fee-installment-master/:id", FeeInstallmentMasterController.updateFeeInstallmentMaster);

/**
 * @swagger
 * /fee-installment-master/delete/{id}:
 *   get:
 *     summary: Delete a fee installment master
 *     tags: [FeeInstallmentMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fee installment master deleted successfully
 *       404:
 *         description: Fee installment master not found
 */
router.get("/fee-installment-master/delete/:id", FeeInstallmentMasterController.deleteFeeInstallmentMaster);

module.exports = router;
