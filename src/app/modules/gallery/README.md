# Gallery API Documentation

## Gallery Management API

The Gallery API provides endpoints for managing image uploads, retrievals, updates, and deletions with support for both **local storage** and **Cloudinary** cloud storage.

### Storage Options

The API supports two storage types that can be configured via environment variables:

1. **Local Storage** (default) - Images stored in `public/uploads/gallery/` folder
2. **Cloudinary** - Images stored in Cloudinary cloud storage

### Configuration

Set the following environment variables in your `.env` file:

```env
# Storage type: "local" or "cloudinary"
STORAGE_TYPE=local

# Base URL for local file serving
BASE_URL=http://localhost:5000

# Cloudinary credentials (only needed if STORAGE_TYPE=cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Base URL

```
/api/v1/gallery
```

### Authentication

Most endpoints require authentication with Admin or Super Admin privileges.

---

## Endpoints

### 1. Upload Images

**POST** `/upload`

Upload multiple images with custom names.

**Auth Required:** Yes (Admin/Super Admin)

**Request:**

-   **Content-Type:** `multipart/form-data`
-   **Body:**
    -   `images`: Array of image files (max 10 files)
    -   `customNames`: JSON string of custom names (optional)

**Supported File Types:** JPEG, JPG, PNG, GIF, WebP
**Max File Size:** 5MB per file

**Example Request:**

```javascript
const formData = new FormData();
formData.append("images", file1);
formData.append("images", file2);
formData.append(
    "customNames",
    JSON.stringify({ 0: "custom-name-1", 1: "custom-name-2" })
);
```

**Response:**

```json
{
    "success": true,
    "status": 200,
    "message": "2 image(s) uploaded successfully",
    "data": [
        {
            "id": "uuid",
            "name": "custom-name-1.jpg",
            "originalName": "original-file.jpg",
            "url": "https://cloudinary-url",
            "cloudinaryId": "public-id",
            "size": 1024567,
            "mimeType": "image/jpeg",
            "isActive": true,
            "description": null,
            "createdAt": "2025-08-15T18:00:00Z",
            "updatedAt": "2025-08-15T18:00:00Z"
        }
    ]
}
```

---

### 2. Get All Images

**GET** `/`

Retrieve all images with pagination and filtering.

**Auth Required:** No

**Query Parameters:**

-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 10)
-   `sortBy`: Sort field (default: createdAt)
-   `sortOrder`: Sort order - asc/desc (default: desc)
-   `searchTerm`: Search in name, originalName, description
-   `name`: Filter by name
-   `mimeType`: Filter by MIME type
-   `isActive`: Filter by active status (true/false)

**Example Request:**

```
GET /gallery?page=1&limit=20&searchTerm=logo&isActive=true
```

**Response:**

```json
{
    "success": true,
    "status": 200,
    "message": "Images fetched successfully",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 45
    },
    "data": [
        {
            "id": "uuid",
            "name": "logo.png",
            "originalName": "company-logo.png",
            "url": "https://cloudinary-url",
            "cloudinaryId": "public-id",
            "size": 1024567,
            "mimeType": "image/png",
            "isActive": true,
            "description": "Company logo",
            "createdAt": "2025-08-15T18:00:00Z",
            "updatedAt": "2025-08-15T18:00:00Z"
        }
    ]
}
```

---

### 3. Get Image by ID

**GET** `/:id`

Retrieve a specific image by its ID.

**Auth Required:** No

**Parameters:**

-   `id`: Image UUID

**Response:**

```json
{
    "success": true,
    "status": 200,
    "message": "Image fetched successfully",
    "data": {
        "id": "uuid",
        "name": "image.jpg",
        "originalName": "original.jpg",
        "url": "https://cloudinary-url",
        "cloudinaryId": "public-id",
        "size": 1024567,
        "mimeType": "image/jpeg",
        "isActive": true,
        "description": "Image description",
        "createdAt": "2025-08-15T18:00:00Z",
        "updatedAt": "2025-08-15T18:00:00Z"
    }
}
```

---

### 4. Update Image

**PATCH** `/:id`

Update image metadata (name, description, active status).

**Auth Required:** Yes (Admin/Super Admin)

**Parameters:**

-   `id`: Image UUID

**Request Body:**

```json
{
    "name": "new-image-name.jpg",
    "description": "Updated description",
    "isActive": false
}
```

**Response:**

```json
{
    "success": true,
    "status": 200,
    "message": "Image updated successfully",
    "data": {
        "id": "uuid",
        "name": "new-image-name.jpg",
        "originalName": "original.jpg",
        "url": "https://cloudinary-url",
        "cloudinaryId": "public-id",
        "size": 1024567,
        "mimeType": "image/jpeg",
        "isActive": false,
        "description": "Updated description",
        "createdAt": "2025-08-15T18:00:00Z",
        "updatedAt": "2025-08-15T18:00:00Z"
    }
}
```

---

### 5. Delete Single Image

**DELETE** `/:id`

Delete a specific image by its ID. This also removes the image from Cloudinary.

**Auth Required:** Yes (Admin/Super Admin)

**Parameters:**

-   `id`: Image UUID

**Response:**

```json
{
    "success": true,
    "status": 200,
    "message": "Image deleted successfully",
    "data": {
        "id": "uuid",
        "name": "deleted-image.jpg",
        "originalName": "original.jpg",
        "url": "https://cloudinary-url",
        "cloudinaryId": "public-id",
        "size": 1024567,
        "mimeType": "image/jpeg",
        "isActive": true,
        "description": null,
        "createdAt": "2025-08-15T18:00:00Z",
        "updatedAt": "2025-08-15T18:00:00Z"
    }
}
```

---

### 6. Delete Multiple Images

**DELETE** `/bulk/delete`

Delete multiple images at once. This also removes all images from Cloudinary.

**Auth Required:** Yes (Admin/Super Admin)

**Request Body:**

```json
{
    "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**

```json
{
    "success": true,
    "status": 200,
    "message": "3 image(s) deleted successfully",
    "data": {
        "count": 3
    }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
    "success": false,
    "status": 400,
    "message": "Invalid file type: image/svg+xml. Only JPEG, PNG, GIF, and WebP are allowed."
}
```

### 401 Unauthorized

```json
{
    "success": false,
    "status": 401,
    "message": "You are not authorized!"
}
```

### 404 Not Found

```json
{
    "success": false,
    "status": 404,
    "message": "No Gallery found!"
}
```

### 500 Internal Server Error

```json
{
    "success": false,
    "status": 500,
    "message": "Failed to upload image to cloud storage"
}
```

---

## Database Schema

```sql
model Gallery {
  id           String   @id @default(uuid())
  name         String
  originalName String
  url          String
  cloudinaryId String?
  localPath    String?
  storageType  String   @default("local")
  size         Int
  mimeType     String
  isActive     Boolean  @default(true)
  description  String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("gallery")
}
```

---

## Features

✅ **Multiple file upload** - Upload up to 10 images at once  
✅ **Custom file naming** - Rename files during upload  
✅ **File validation** - Type and size validation  
✅ **Dual storage support** - Local storage or Cloudinary cloud storage  
✅ **Pagination** - Efficient data retrieval  
✅ **Search & Filter** - Find images by various criteria  
✅ **Bulk operations** - Delete multiple images  
✅ **Metadata management** - Update image information  
✅ **Auto cleanup** - Removes files from both local and cloud storage on deletion  
✅ **Static file serving** - Automatic serving of local images via `/public` endpoint

## Usage Tips

1. **Storage Configuration**: Set `STORAGE_TYPE` environment variable to "local" or "cloudinary"
2. **Local Storage**: Images are stored in `public/uploads/gallery/` and served via `/public/uploads/gallery/` endpoint
3. **File Upload**: Always use `multipart/form-data` for file uploads
4. **Custom Names**: Provide custom names as JSON string in the format `{index: "name"}`
5. **Search**: Use `searchTerm` for general search across name, originalName, and description
6. **Filtering**: Combine multiple filters for specific results
7. **Pagination**: Always implement pagination for better performance
8. **Error Handling**: Check for specific error codes to handle different scenarios
