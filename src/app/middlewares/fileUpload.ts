import multer from "multer";
import path from "path";
import fs from "fs";

// Basic storage for general uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

// Gallery-specific storage configuration
const galleryUploadPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "gallery"
);

// Ensure gallery upload directory exists
if (!fs.existsSync(galleryUploadPath)) {
    fs.mkdirSync(galleryUploadPath, { recursive: true });
}

const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, galleryUploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `gallery-${uniqueSuffix}${extension}`);
    },
});

// Basic upload configuration
export const upload = multer({ storage: storage });

// Gallery-specific upload configuration
export const galleryUpload = multer({
    storage: galleryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10, // Maximum 10 files
    },
    fileFilter: function (req, file, cb) {
        // Allow image types
        const allowedMimes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, and WebP are allowed.`
                )
            );
        }
    },
});
