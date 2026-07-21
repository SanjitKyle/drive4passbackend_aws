const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
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
 *               - role
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
 *               role:
 *                 type: string
 *                 enum: [admin, student, instructor, branch-admin]
 *               school_id:
 *                 type: string
 *               branch_id:
 *                 type: string
 *     responses:
 *       "201":
 *         description: User created successfully
 *       "400":
 *         description: Bad request
 */
router.post('/users', UserController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       "200":
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       "500":
 *         description: Internal Server Error
 */
router.get('/users', UserController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   post:
 *     summary: Update a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, student, instructor, branch-admin]
 *               status:
 *                 type: number
 *                 description: 0 for inactive, 1 for active
 *     responses:
 *       "200":
 *         description: User updated successfully
 *       "400":
 *         description: Invalid request or user not found
 *       "500":
 *         description: Internal Server Error
 */
router.post('/users/:id', UserController.updateUser);

/**
 * @swagger
 * /users/delete/{id}:
 *   get:
 *     summary: Delete a user (soft delete)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       "200":
 *         description: User deleted successfully
 *       "400":
 *         description: User not found
 *       "500":
 *         description: Internal Server Error
 */
router.get('/users/delete/:id', UserController.deleteUser);

module.exports = router;
