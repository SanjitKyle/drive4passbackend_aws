const express = require("express");
const router = express.Router();

const SaleController = require("../../controllers/DS/sale.controller");

/**
 * @swagger
 * tags:
 *   name: Sale
 *   description: Sale management
 */

/**
 * @swagger
 * /ds/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pupil_id
 *               - package_id
 *               - area_id
 *             properties:
 *               pupil_id:
 *                 type: string
 *               package_id:
 *                 type: string
 *               area_id:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 */
router.post("/sales", SaleController.createSale);

/**
 * @swagger
 * /ds/sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sale]
 *     responses:
 *       200:
 *         description: A list of sales
 */
router.get("/sales", SaleController.getAllSales);

/**
 * @swagger
 * /ds/sales/{id}:
 *   get:
 *     summary: Get a single sale by ID
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale details
 *       404:
 *         description: Sale not found
 */
router.get("/sales/:id", SaleController.getSaleById);

/**
 * @swagger
 * /ds/sales/{id}:
 *   post:
 *     summary: Update a sale
 *     tags: [Sale]
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
 *               pupil_id:
 *                 type: string
 *               package_id:
 *                 type: string
 *               area_id:
 *                 type: string
 *               credited_hour:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       404:
 *         description: Sale not found
 */
router.post("/sales/:id", SaleController.updateSale);

/**
 * @swagger
 * /ds/sales/delete/{id}:
 *   get:
 *     summary: Soft delete a sale
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       404:
 *         description: Sale not found
 */
router.get("/sales/:id", SaleController.deleteSale);

/**
 * @swagger
 * /ds/sales/pupil/{id}:
 *   get:
 *     summary: Get all sales by pupil ID
 *     tags: [Sale]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales fetched successfully
 *       404:
 *         description: No sales found
 */
router.get("/sales/pupil/:id", SaleController.getSaleByPupilId);

module.exports = router;
