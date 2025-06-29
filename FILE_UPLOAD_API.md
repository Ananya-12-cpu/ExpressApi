# File Upload API Documentation

This document describes the file upload API endpoints implemented in the Express.js Todo application.

## Overview

The file upload API allows users to upload, manage, and download files. All endpoints require authentication via JWT token.

## Base URL

```
http://localhost:3000/api/files
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Upload Single File

**POST** `/api/files/upload`

Upload a single file to the server.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: The file to upload (required)
  - `description`: Optional description for the file

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 1,
    "filename": "file-1234567890-123456789.jpg",
    "originalName": "photo.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000,
    "description": "My photo",
    "uploadedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Upload Multiple Files

**POST** `/api/files/upload-multiple`

Upload multiple files (up to 10) to the server.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `files`: Array of files to upload (required, max 10)
  - `description`: Optional description for all files

**Response:**
```json
{
  "message": "3 files uploaded successfully",
  "files": [
    {
      "id": 1,
      "filename": "file-1234567890-123456789.jpg",
      "originalName": "photo1.jpg",
      "mimetype": "image/jpeg",
      "size": 1024000,
      "description": "My photos",
      "uploadedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### 3. Get All Files

**GET** `/api/files`

Retrieve all files with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Number of files per page (default: 10)

**Response:**
```json
{
  "files": [
    {
      "id": 1,
      "filename": "file-1234567890-123456789.jpg",
      "originalName": "photo.jpg",
      "mimetype": "image/jpeg",
      "size": 1024000,
      "description": "My photo",
      "uploadedAt": "2024-01-01T12:00:00.000Z",
      "uploader": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalFiles": 50,
    "filesPerPage": 10
  }
}
```

### 4. Get Files by User

**GET** `/api/files/user/:userId?`

Retrieve files uploaded by a specific user. If no userId is provided, returns current user's files.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Number of files per page (default: 10)

**Response:** Same format as "Get All Files"

### 5. Get Single File

**GET** `/api/files/:id`

Retrieve details of a specific file.

**Response:**
```json
{
  "file": {
    "id": 1,
    "filename": "file-1234567890-123456789.jpg",
    "originalName": "photo.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000,
    "description": "My photo",
    "uploadedAt": "2024-01-01T12:00:00.000Z",
    "uploader": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 6. Download File

**GET** `/api/files/:id/download`

Download a file from the server.

**Response:** File download with original filename

### 7. Update File Description

**PATCH** `/api/files/:id/description`

Update the description of a file (only by file owner).

**Request Body:**
```json
{
  "description": "Updated description"
}
```

**Response:**
```json
{
  "message": "File description updated successfully",
  "file": {
    "id": 1,
    "filename": "file-1234567890-123456789.jpg",
    "originalName": "photo.jpg",
    "description": "Updated description",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  }
}
```

### 8. Delete File

**DELETE** `/api/files/:id`

Delete a file (only by file owner).

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

## File Restrictions

### Allowed File Types:
- Images: JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX
- Text files: TXT
- Spreadsheets: XLS, XLSX

### File Size Limits:
- Maximum file size: 10MB per file
- Maximum files per upload: 10 files

## Error Responses

### File Too Large
```json
{
  "error": "File too large. Maximum file size is 10MB."
}
```

### Invalid File Type
```json
{
  "error": "Invalid file type. Only images, PDFs, documents, and text files are allowed."
}
```

### File Not Found
```json
{
  "error": "File not found"
}
```

### Access Denied
```json
{
  "error": "Access denied"
}
```

## Example Usage with cURL

### Upload Single File
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.jpg" \
  -F "description=My uploaded file"
```

### Upload Multiple Files
```bash
curl -X POST http://localhost:3000/api/files/upload-multiple \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.pdf" \
  -F "description=Multiple files"
```

### Download File
```bash
curl -X GET http://localhost:3000/api/files/1/download \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output downloaded_file.jpg
```

## Database Schema

The file uploads are stored in the `files` table with the following structure:

```sql
CREATE TABLE files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  originalName VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(500) NOT NULL,
  uploadedBy INT NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES Users(id)
);
```

## File Storage

Files are stored in the `uploads/` directory in the project root. The directory is automatically created if it doesn't exist.

## Security Features

1. **Authentication Required**: All endpoints require valid JWT tokens
2. **File Type Validation**: Only allowed file types can be uploaded
3. **File Size Limits**: Prevents large file uploads
4. **Ownership Validation**: Users can only modify/delete their own files
5. **Unique Filenames**: Generated to prevent conflicts
6. **Path Validation**: Prevents directory traversal attacks 