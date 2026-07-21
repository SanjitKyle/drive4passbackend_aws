const express = require("express");
const router = express.Router();

const PupilController = require("../../controllers/DS/pupil.controller");

/**
 * @swagger
 * tags:
 *   name: Pupil
 *   description: Pupil management
 */

/**
 * @swagger
 * /ds/pupils:
 *   post:
 *     summary: Create a new pupil
 *     tags: [Pupil]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *               - email
 *               - instructor_id
 *               - package_id
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               instructor_id:
 *                 type: string
 *               area_id:
 *                 type: string
 *               package_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pupil created successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 */
router.post("/pupils", PupilController.createPupil);

/**
 * @swagger
 * /ds/pupils:
 *   get:
 *     summary: Get all pupils
 *     tags: [Pupil]
 *     responses:
 *       200:
 *         description: A list of pupils
 */
router.get("/pupils", PupilController.getAllPupils);

/**
 * @swagger
 * /ds/pupils/{id}:
 *   get:
 *     summary: Get a single pupil by ID
 *     tags: [Pupil]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pupil details
 *       404:
 *         description: Pupil not found
 */
router.get("/pupils/:id", PupilController.getPupilById);

/**
 * @swagger
 * /ds/pupils/{id}:
 *   post:
 *     summary: Update a pupil
 *     tags: [Pupil]
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
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               instructor_id:
 *                 type: string
 *               area_id:
 *                 type: string
 *               package_id:
 *                 type: string
 *               active:
 *                 type: number
 *               progress:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pupil updated successfully
 *       404:
 *         description: Pupil not found
 */
router.post("/pupils/:id", PupilController.updatePupil);

/**
 * @swagger
 * /ds/pupils/delete/{id}:
 *   get:
 *     summary: Soft delete a pupil
 *     tags: [Pupil]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pupil deleted successfully
 *       404:
 *         description: Pupil not found
 */
router.get("/pupils/delete/:id", PupilController.deletePupil);

module.exports = router;
