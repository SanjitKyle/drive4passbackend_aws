const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/session.controller');

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_name
 *               - start_date
 *               - end_date
 *             properties:
 *               session_name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Bad request
 */
router.post('/sessions/', SessionController.createSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all sessions
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: A list of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal Server Error
 */
router.get('/sessions/', SessionController.getSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session details
 *       404:
 *         description: Session not found
 */
router.get('/sessions/:id', SessionController.getSessionById);

/**
 * @swagger
 * /sessions/{id}:
 *   post:
 *     summary: Update a session
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               session_name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: number
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Invalid request or session not found
 */
router.post('/sessions/:id', SessionController.updateSession);

/**
 * @swagger
 * /sessions/delete/{id}:
 *   get:
 *     summary: Delete a session
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the session to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       400:
 *         description: Session not found
 */
router.get('/sessions/delete/:id', SessionController.deleteSession);

module.exports = router;
