const express = require("express");
const router = express.Router();
const MessageController = require("../../controllers/DS/message.controller");

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Driving School Chat Message endpoints
 */

/**
 * @swagger
 * /ds/messages:
 *   post:
 *     summary: Send a message in a conversation
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversation_id
 *               - text
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *               text:
 *                 type: string
 *                 example: "Hello! What time is tomorrow's lesson?"
 *               sender_type:
 *                 type: string
 *                 enum: [pupil, InstructorMaster]
 *                 description: "Optional (automatically detected from token if not provided)"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Conversation not found
 */
router.post("/messages", MessageController.sendMessage);

/**
 * @swagger
 * /ds/messages/{conversation_id}:
 *   get:
 *     summary: Get all messages for a specific conversation
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: List of messages
 *       400:
 *         description: Invalid conversation ID
 */
router.get(
  "/messages/:conversation_id",
  MessageController.getMessagesByConversation
);

/**
 * @swagger
 * /ds/messages/{conversation_id}/read:
 *   put:
 *     summary: Mark all unread messages in a conversation as read
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Messages marked as read
 */
router.put(
  "/messages/:conversation_id/read",
  MessageController.markAsRead
);

/**
 * @swagger
 * /ds/messages/{id}/me:
 *   delete:
 *     summary: Delete a message for current user only
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted for requester
 *       404:
 *         description: Message not found
 */
router.delete(
  "/messages/:id/me",
  MessageController.deleteMessageForMe
);

/**
 * @swagger
 * /ds/messages/{id}/everyone:
 *   delete:
 *     summary: Delete a message for everyone (sender only)
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted for everyone
 *       403:
 *         description: Forbidden (not the sender)
 *       404:
 *         description: Message not found
 */
router.delete(
  "/messages/:id/everyone",
  MessageController.deleteMessageForEveryone
);

module.exports = router;
