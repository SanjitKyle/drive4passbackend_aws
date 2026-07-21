const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth.middleware");

const PriceMasterController = require(
  "../../controllers/DS/price_master.controller"
);

/**
 * @swagger
 * tags:
 *   name: PriceMaster
 *   description: Price Master management
 */

/**
 * @swagger
 * /ds/price-masters:
 *   post:
 *     summary: Create a new price for a package at a specific branch
 *     tags: [PriceMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branch_id
 *               - package_id
 *               - price
 *             properties:
 *               branch_id:
 *                 type: string
 *                 description: The ID of the branch
 *               package_id:
 *                 type: string
 *                 description: The ID of the package
 *               price:
 *                 type: number
 *                 description: The price of the package
 *     responses:
 *       201:
 *         description: Price created successfully
 *       400:
 *         description: Bad request (e.g., missing parameters, invalid price)
 *       404:
 *         description: Branch or Package not found
 *       409:
 *         description: Price already exists for this package & branch
 */
router.post("/price-masters",  PriceMasterController.createPrice);

/**
 * @swagger
 * /ds/price-masters:
 *   get:
 *     summary: Get all prices for the school
 *     tags: [PriceMaster]
 *     responses:
 *       200:
 *         description: A list of prices with branch and package details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       school_id:
 *                         type: string
 *                       branch_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       package_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           package_name:
 *                             type: string
 *                           duration:
 *                             type: number
 *                       price:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get("/price-masters",  PriceMasterController.getPrices);

/**
 * @swagger
 * /ds/price-masters/{id}:
 *   get:
 *     summary: Get a specific price by its ID
 *     tags: [PriceMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The price ID
 *     responses:
 *       200:
 *         description: Price details
 *       404:
 *         description: Price not found
 */
router.get("/price-masters/:id",  PriceMasterController.getPriceById);

/**
 * @swagger
 * /ds/price-masters/{id}:
 *   post:
 *     summary: Update a price
 *     tags: [PriceMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The price ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 description: The new price
 *     responses:
 *       200:
 *         description: Price updated successfully
 *       400:
 *         description: Bad request (e.g., invalid price)
 *       404:
 *         description: Price not found
 */
router.post("/price-masters/:id", PriceMasterController.updatePrice);

/**
 * @swagger
 * /ds/price-masters/delete/{id}:
 *   get:
 *     summary: Delete a price
 *     tags: [PriceMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The price ID
 *     responses:
 *       200:
 *         description: Price deleted successfully
 *       404:
 *         description: Price not found
 */
router.get("/price-masters/delete/:id",  PriceMasterController.deletePrice);

module.exports = router;
