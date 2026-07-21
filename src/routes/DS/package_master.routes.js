const express = require('express');
const router = express.Router();
const auth=require('../../middleware/auth.middleware')
const PackageMasterController = require('../../controllers/DS/package_master.controller');

/**
 * @swagger
 * tags:
 *   name: PackageMaster
 *   description: Package Master management
 */

/**
 * @swagger
 * /ds/package-masters:
 *   post:
 *     summary: Create a new package
 *     tags: [PackageMaster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - package_name
 *               - package_slug
 *               - duration
 *               - area
 *             properties:
 *               package_name:
 *                 type: string
 *                 example: Intensive Driving Course
 *               package_slug:
 *                 type: string
 *                 example: intensive-driving-course
 *               duration:
 *                 type: number
 *                 example: 30
 *               area:
 *                 type: string
 *                 example: London
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Bad request
 */
router.post("/package-masters", PackageMasterController.createPackageMaster);

/**
 * @swagger
 * /ds/package-masters:
 *   get:
 *     summary: Get all packages
 *     tags: [PackageMaster]
 *     responses:
 *       200:
 *         description: List of all packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       package_name:
 *                         type: string
 *                       package_slug:
 *                         type: string
 *                       duration:
 *                         type: number
 *                       area:
 *                         type: string
 */
router.get("/package-masters", PackageMasterController.getPackagesMaster);

/**
 * @swagger
 * /ds/package-masters/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [PackageMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package details retrieved successfully
 *       404:
 *         description: Package not found
 */
router.get("/package-masters/:id", PackageMasterController.getSpecificMaster);

/**
 * @swagger
 * /ds/package-masters/{id}:
 *   post:
 *     summary: Update a package
 *     tags: [PackageMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               package_name:
 *                 type: string
 *                 example: Intensive Driving Course
 *               package_slug:
 *                 type: string
 *                 example: intensive-driving-course
 *               duration:
 *                 type: number
 *                 example: 35
 *               area:
 *                 type: string
 *                 example: Manchester
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Package not found
 */
router.post("/package-masters/:id", PackageMasterController.updatePackageMaster);

/**
 * @swagger
 * /ds/package-masters/delete/{id}:
 *   get:
 *     summary: Delete a package
 *     tags: [PackageMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       404:
 *         description: Package not found
 */
router.get("/package-masters/delete/:id", PackageMasterController.deletePackageMaster);
/**
 * @swagger
 * /ds/package-masters/getbyarea/{id}:
 *   get:
 *     summary: Get packages by area ID
 *     tags: [PackageMaster]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *         example: 6857f2a1b34c56789d123456
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6857f2a1b34c56789d123456
 *                       package_name:
 *                         type: string
 *                         example: Intensive Driving Course
 *                       package_slug:
 *                         type: string
 *                         example: intensive-driving-course
 *                       duration:
 *                         type: number
 *                         example: 30
 *                       area:
 *                         type: string
 *                         example: London
 *       404:
 *         description: No packages found for this area
 *       500:
 *         description: Internal server error
 */
router.get(
  "/package-masters/getbyarea/:id",
  PackageMasterController.getPackagesByArea
);module.exports = router;
