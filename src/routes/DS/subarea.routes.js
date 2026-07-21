const express = require("express");
const router = express.Router();

const SubAreaController = require("../../controllers/DS/subarea.controller");

/**
 * @swagger
 * tags:
 *   name: SubArea
 *   description: Sub Area management
 */

/**
 * @swagger
 * /ds/subareas/create:
 *   post:
 *     summary: Create a new sub area
 *     tags: [SubArea]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - area
 *               - postcode
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 example: "North Wembley"
 *               area:
 *                 type: string
 *                 description: Area ID
 *                 example: "6859b6f3a5d4b1f6c1234567"
 *               postcode:
 *                 type: string
 *                 example: "HA0 3AA"
 *               status:
 *                 type: string
 *                 enum: [Active, Deactive]
 *                 example: "Active"
 *     responses:
 *       201:
 *         description: Sub area created successfully
 *       400:
 *         description: Bad request
 */
router.post("/subareas/create", SubAreaController.createSubArea);

/**
 * @swagger
 * /ds/subareas:
 *   get:
 *     summary: Get all sub areas
 *     tags: [SubArea]
 *     responses:
 *       200:
 *         description: Successfully fetched all sub areas
 *       500:
 *         description: Internal server error
 */
router.get("/subareas", SubAreaController.getAllSubAreas);

/**
 * @swagger
 * /ds/subareas/{id}:
 *   get:
 *     summary: Get a sub area by ID
 *     tags: [SubArea]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sub Area ID
 *         schema:
 *           type: string
 *           example: "6859b6f3a5d4b1f6c1234567"
 *     responses:
 *       200:
 *         description: Successfully fetched sub area
 *       404:
 *         description: Sub area not found
 *       500:
 *         description: Internal server error
 */
router.get("/subareas/:id", SubAreaController.getSubAreaById);

/**
 * @swagger
 * /ds/subareas/update/{id}:
 *   post:
 *     summary: Update a sub area
 *     tags: [SubArea]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sub Area ID
 *         schema:
 *           type: string
 *           example: "6859b6f3a5d4b1f6c1234567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "South Wembley"
 *               area:
 *                 type: string
 *                 example: "6859b6f3a5d4b1f6c1234567"
 *               postcode:
 *                 type: string
 *                 example: "HA0 4BB"
 *               status:
 *                 type: string
 *                 enum: [Active, Deactive]
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: Sub area updated successfully
 *       404:
 *         description: Sub area not found
 *       500:
 *         description: Internal server error
 */
router.post("/subareas/update/:id", SubAreaController.updateSubArea);

/**
 * @swagger
 * /ds/subareas/delete/{id}:
 *   post:
 *     summary: Delete a sub area
 *     tags: [SubArea]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sub Area ID
 *         schema:
 *           type: string
 *           example: "6859b6f3a5d4b1f6c1234567"
 *     responses:
 *       200:
 *         description: Sub area deleted successfully
 *       404:
 *         description: Sub area not found
 *       500:
 *         description: Internal server error
 */
router.post("/subareas/delete/:id", SubAreaController.deleteSubArea);

/**
 * @swagger
 * /ds/subareas/area/{id}:
 *   get:
 *     summary: Get all subareas by area ID
 *     tags: [SubArea]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Area ID
 *         schema:
 *           type: string
 *           example: "6859b6f3a5d4b1f6c1234567"
 *     responses:
 *       200:
 *         description: Successfully fetched subareas
 *       404:
 *         description: No subareas found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/subareas/area/:id",
    SubAreaController.getsubareabyarea
);

module.exports = router;