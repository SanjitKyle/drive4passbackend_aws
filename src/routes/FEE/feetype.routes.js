const express = require("express");
const router = express.Router();
const FeeTypeController = require("../../controllers/FEE/feetype.controller");

/**
 * @swagger
 * tags:
 *   name: FeeType
 *   description: Fee Type management
 */

/**
 * @swagger
 * /fee-type:
 *   post:
 *     summary: Create a new fee type
 *     tags: [FeeType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fee_type_name
 *             properties:
 *               fee_type_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fee type created successfully
 *       400:
 *         description: Bad request
 */
router.post("/fee-type/", FeeTypeController.createFeeType);

/**
 * @swagger
 * /fee-type/{id}:
 *   post:
 *     summary: Update a fee type
 *     tags: [FeeType]
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
 *               fee_type_name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: integer
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Fee type updated successfully
 *       404:
 *         description: Fee type not found
 */
router.post("/fee-type/:id", FeeTypeController.updateFeeType);

/**
 * @swagger
 * /fee-type:
 *   get:
 *     summary: Get all fee types
 *     tags: [FeeType]
 *     responses:
 *       200:
 *         description: A list of all fee types.
 */
router.get("/fee-type/", FeeTypeController.getFeeTypes);

/**
 * @swagger
 * /fee-type/delete/{id}:
 *   get:
 *     summary: Delete a fee type
 *     tags: [FeeType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fee type deleted successfully
 *       404:
 *         description: Fee type not found
 */
router.get("/fee-type/delete/:id", FeeTypeController.deleteFeeType);

module.exports = router;
