const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const TodoController = require("../controllers/todoController");

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo details
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Failed to fetch todo
 */
// Get a single todo
router.get("/:id", TodoController.getPostWithUser);

/**
 * @swagger
 * /api/todos/add:
 *   post:
 *     summary: Create a new todo
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *                 description: ID of the user creating the todo
 *     responses:
 *       200:
 *         description: Todo created successfully
 *       500:
 *         description: Failed to create todo
 */

// Create a new todo
router.post("/add", TodoController.addTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Failed to update todo
 */
// Update a todo
router.put("/:id", TodoController.patchTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Failed to delete todo
 */
// Delete a todo
router.delete("/:id", TodoController.deleteTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos (paginated)
 *     tags:
 *       - Todos
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
 *         description: Number of todos per page
 *       - in: query
 *         name: _sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., title, createdAt)
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
 *         description: Global search on title and description
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by description
 *     responses:
 *       200:
 *         description: List of todos
 *       500:
 *         description: Failed to fetch todos
 */
// Get all todos
router.get("/", TodoController.getTodos);

module.exports = router;
