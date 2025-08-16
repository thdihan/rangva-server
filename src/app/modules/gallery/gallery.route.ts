import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { GalleryController } from "./gallery.controller";
import { galleryUpload } from "../../middlewares/fileUpload";
import { validateRequest } from "../../middlewares/validateRequest";
import { GalleryValidation } from "./gallery.validation";

const router = express.Router();

// Middleware to handle both 'image' and 'images' field names
const handleMultipleUploads = (req: any, res: any, next: any) => {
    const uploadMiddleware = galleryUpload.fields([
        { name: "images", maxCount: 10 },
        { name: "image", maxCount: 10 },
    ]);

    uploadMiddleware(req, res, (err: any) => {
        if (err) {
            return next(err);
        }

        // Normalize field names - combine both 'image' and 'images' into 'images'
        if (req.files) {
            const allFiles = [];
            if (req.files.images) {
                console.log(req.files.images);
                allFiles.push(...req.files.images);
            }
            if (req.files.image) {
                console.log(req.files.image);
                allFiles.push(...req.files.image);
            }
            req.files = allFiles; // Set as array for controller
        }

        next();
    });
};

router.post(
    "/upload",
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    handleMultipleUploads,
    GalleryController.uploadImages
);

router.get("/", GalleryController.getAllImages);

router.get("/:id", GalleryController.getImageById);

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(GalleryValidation.updateGallery),
    GalleryController.updateImageById
);

router.delete(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    GalleryController.deleteImage
);

router.delete(
    "/bulk/delete",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(GalleryValidation.deleteMultipleImages),
    GalleryController.deleteMultipleImages
);

export const GalleryRoutes = router;
