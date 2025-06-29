const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

/**
 * @swagger
 * /api/roles/add:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Roles
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *       500:
 *         description: Failed to create role
 */
// Create a new role
router.post("/add", roleController.createRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags:
 *       - Roles
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
 *         description: Number of roles per page
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
 *         description: Global search on name and description
 *       - in: query
 *         name: _search_fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to apply global search on (e.g., name,description)
 *     responses:
 *       200:
 *         description: List of roles
 *       500:
 *         description: Failed to fetch roles
 */
// Get all roles
router.get("/", roleController.getRoles);

/**
 * @swagger
 * /api/roles/assign:
 *   post:
 *     summary: Assign a role to a user
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: integer
 *               roleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       404:
 *         description: User or role not found
 *       500:
 *         description: Failed to assign role
 */
// Assign role to user
router.post("/assign", roleController.assignRoleToUser);

/**
 * @swagger
 * /api/roles/user/{id}:
 *   get:
 *     summary: Get a user with their roles
 *     tags:
 *       - Roles
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
 *         description: User with roles
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user roles
 */
// Get user with roles
router.get("/user/:id", roleController.getUserWithRoles);

module.exports = router;
