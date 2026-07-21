// const express = require("express");
// const router = express.Router();

// const NotificationRoute = require("../../controllers/DS/message_token_store");
// const NotificationStore = require("../../controllers/DS/NotificationStore")
// /**
//  * @swagger
//  * tags:
//  *   name: Notifications
//  *   description: Firebase notification and FCM token management
//  */

// /**
//  * @swagger
//  * /ds/message/save-token:
//  *   post:
//  *     summary: Save or update FCM token for logged-in user
//  *     tags: [Notifications]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - token
//  *             properties:
//  *               token:
//  *                 type: string
//  *                 description: Firebase Cloud Messaging token
//  *               platform:
//  *                 type: string
//  *                 enum: [android, ios, web]
//  *                 description: Device platform
//  *     responses:
//  *       200:
//  *         description: Token saved successfully
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.post("/message/save-token", NotificationRoute.saveToken);




// module.exports = router;

const express = require("express");
const router = express.Router();

const NotificationRoute = require("../../controllers/DS/message_token_store");
const NotificationStore = require("../../controllers/DS/NotificationStore");


/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Firebase notification and notification storage management
 */


/**
 * @swagger
 * /ds/message/save-token:
 *   post:
 *     summary: Save or update FCM token for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Firebase Cloud Messaging token
 *               platform:
 *                 type: string
 *                 enum: [android, ios, web]
 *                 description: Device platform
 *     responses:
 *       200:
 *         description: Token saved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/message/save-token", NotificationRoute.saveToken);



/**
 * @swagger
 * /ds/notification/get-notification:
 *   get:
 *     summary: Get all notifications of logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       message:
 *                         type: string
 *                       sender_id:
 *                         type: string
 *                       receiver_id:
 *                         type: string
 *                       redirect_url:
 *                         type: string
 *                       is_read:
 *                         type: boolean
 *       404:
 *         description: No notifications found
 *       500:
 *         description: Server error
 */
router.get(
    "/notification/get-notification",
    NotificationStore.getNotification
);



/**
 * @swagger
 * /ds/notification/mark-as-read:
 *   post:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: No notifications found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/notification/mark-as-read",
    NotificationStore.markAsRead
);



module.exports = router;