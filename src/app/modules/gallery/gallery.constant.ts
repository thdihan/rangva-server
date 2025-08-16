export const galleryFilterableFields = [
    "name",
    "mimeType",
    "isActive",
    "searchTerm",
];

export const gallerySearchableFields = ["name", "originalName", "description"];

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Storage configuration
export const STORAGE_TYPE = process.env.STORAGE_TYPE || "local"; // "cloudinary" or "local"
export const LOCAL_UPLOAD_PATH = "public/uploads/gallery";
export const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
