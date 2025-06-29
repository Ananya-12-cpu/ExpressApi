const express = require("express");
const router = express.Router();
const {
  upload,
  uploadFile,
  getAllFiles,
  getFilesByUser,
  getFile,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const uploadErrorHandler = require("../middleware/uploadErrorMiddleware");

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a single file
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request or file too large
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Upload single file
router.post("/upload", uploadFile);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files (paginated)
 *     tags:
 *       - Files
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
 *         description: Number of files per page
 *       - in: query
 *         name: _sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., originalName, createdAt)
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
 *         description: Global search on originalName and description
 *     responses:
 *       200:
 *         description: List of files
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get all files (with pagination)
router.get("/", getAllFiles);

/**
 * @swagger
 * /api/files/user/{userId}:
 *   get:
 *     summary: Get files uploaded by a specific user (paginated)
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: integer
 *         description: User ID (if omitted, gets files for current user)
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *         description: Number of files per page
 *     responses:
 *       200:
 *         description: List of user files
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Get files by specific user
router.get("/user/:userId?", getFilesByUser);

/**
 * @swagger
 * /api/files/{id}:
 *   get:
 *     summary: Get file details by ID
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       200:
 *         description: File details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
// Get single file details
router.get("/:id", getFile);

/**
 * @swagger
 * /api/files/{id}/download:
 *   get:
 *     summary: Download a file by ID
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       200:
 *         description: File downloaded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
// Download file
router.get("/:id/download", downloadFile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file by ID
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
// Delete file
router.delete("/:id", deleteFile);

// Error handling middleware for upload errors
router.use(uploadErrorHandler);

module.exports = router;
