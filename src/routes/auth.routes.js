const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require("../config/multer");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /student-signup:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *               - school_id
 *               - branch_id
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               school_id:
 *                 type: string
 *               branch_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/student-signup', AuthController.studentSignup);

/**
 * @swagger
 * /student-login:
 *   post:
 *     summary: Student login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Bad request
 */
router.post('/student-login', AuthController.studentLogin);


/**
 * @swagger
 * /instructor-signup:
 *   post:
 *     summary: Register a new instructor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *               - password
 *               - school_id
 *               - branch_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@example.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: StrongPassword@123
 *               school_id:
 *                 type: string
 *                 example: 64f1a2b9c1234567890abcd1
 *               branch_id:
 *                 type: string
 *                 example: 64f1a2b9c1234567890abcd2
 *     responses:
 *       201:
 *         description: Instructor registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/instructor-signup',upload.single('upload_licence_copy'),AuthController.instructorSingup);
/**
 * @swagger
 * /instructor-login:
 *   post:
 *     summary: Instructor login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: instructor@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Bad request
 */
router.post('/instructor-login',AuthController.instructorLogin);

/**
 * @swagger
 * /validateToken:
 *   get:
 *     summary: Validate the JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized
 */
router.get('/validateToken', authMiddleware, AuthController.validateToken);

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change the user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/change-password", authMiddleware, AuthController.changePassword);


module.exports = router;