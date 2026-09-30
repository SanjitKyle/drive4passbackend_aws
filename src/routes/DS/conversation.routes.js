const express = require("express");
const router = express.Router();
const ConversationController = require("../../controllers/DS/conversation.controller");

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Driving School Chat Conversation endpoints
 */

/**
 * @swagger
 * /ds/conversations:
 *   post:
 *     summary: Create or get existing conversation between pupil and instructor
 *     tags: [Conversation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pupil_id
 *               - instructor_id
 *             properties:
 *               pupil_id:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *               instructor_id:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *     responses:
 *       200:
 *         description: Conversation retrieved or created successfully
 *       400:
 *         description: Bad request (missing pupil_id or instructor_id)
 */
router.post("/conversations", ConversationController.getOrCreateConversation);

/**
 * @swagger
 * /ds/conversations:
 *   get:
 *     summary: Get all conversations for the logged-in user
 *     tags: [Conversation]
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Unauthorized
 */
router.get("/conversations", ConversationController.getMyConversations);

/**
 * @swagger
 * /ds/conversations/{id}:
 *   get:
 *     summary: Get a single conversation by ID
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation details
 *       404:
 *         description: Conversation not found
 */
router.get("/conversations/:id", ConversationController.getConversationById);

module.exports = router;
