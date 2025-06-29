const express = require("express");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/userController");

/**
 * @swagger
 * /api/users/add:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Failed to create user
 */
// Create a new user
router.post("/add", userController.addUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user and their todos by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details with todos
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user
 */
// Get a single user
router.get("/:id", userController.getUserCreatedPost);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update user
 */
// Update a user
router.put("/:id", userController.patchUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
// Delete a user
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *       - in: query
 *         name: _sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., name, createdAt)
 *       - in: query
 *         name: _sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ASC or DESC)
 *       - in: query
 *         name: _search
 *         schema:
 *           type: string
 *         description: Global search on name and email
 *       - in: query
 *         name: _search_fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to apply global search on (e.g., name,email)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Failed to fetch users
 */
// Get all users
router.get("/", userController.getUsers);

module.exports = router;
