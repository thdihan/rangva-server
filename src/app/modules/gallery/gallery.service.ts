import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { formatQueryOptions } from "../../utils/formatQueryOptions";
import { Prisma } from "../../../generated/prisma";
import prisma from "../../utils/prisma";
import {
    gallerySearchableFields,
    ALLOWED_IMAGE_TYPES,
    MAX_FILE_SIZE,
    STORAGE_TYPE,
    LOCAL_UPLOAD_PATH,
    BASE_URL,
} from "./gallery.constant";
import { uploadToCloud } from "../../middlewares/uploadToCloud";
import path from "path";
import fs from "fs";

interface IPaginationOptions {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

// Helper function to save file locally
const saveFileLocally = async (
    file: Express.Multer.File,
    customName: string
): Promise<{ url: string; filePath: string }> => {
    const extension = path.extname(file.originalname);
    const fileName = `${customName}-${Date.now()}${extension}`;
    const uploadDir = path.join(process.cwd(), LOCAL_UPLOAD_PATH);
    const filePath = path.join(uploadDir, fileName);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Copy file from temp location to permanent location
    fs.copyFileSync(file.path, filePath);

    // Clean up temp file
    if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }

    const url = `${BASE_URL}/${LOCAL_UPLOAD_PATH}/${fileName}`.replace(
        /\\/g,
        "/"
    );

    return { url, filePath: fileName };
};

const uploadImages = async (
    files: Express.Multer.File[],
    customNames: { [key: string]: string }
) => {
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, and WebP are allowed.`
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `File size too large: ${file.originalname}. Maximum size is 5MB.`
            );
        }

        try {
            // Get custom name or use original name
            const customName =
                customNames[i] || path.parse(file.originalname).name;
            const extension = path.extname(file.originalname);
            const finalName = `${customName}${extension}`;

            let imageUrl: string;
            let cloudinaryId: string | null = null;
            let localFilePath: string | null = null;

            if (STORAGE_TYPE === "cloudinary") {
                // Upload to cloudinary
                const cloudinaryResponse = await uploadToCloud(file);

                if (!cloudinaryResponse) {
                    throw new ApiError(
                        httpStatus.INTERNAL_SERVER_ERROR,
                        `Failed to upload ${file.originalname} to cloud storage`
                    );
                }

                imageUrl = cloudinaryResponse.secure_url;
                cloudinaryId = cloudinaryResponse.public_id;
            } else {
                // Save locally
                const localResult = await saveFileLocally(file, customName);
                imageUrl = localResult.url;
                localFilePath = localResult.filePath;
            }

            // Save to database
            const savedImage = await prisma.gallery.create({
                data: {
                    name: finalName,
                    originalName: file.originalname,
                    url: imageUrl,
                    cloudinaryId: cloudinaryId,
                    localPath: localFilePath,
                    size: file.size,
                    mimeType: file.mimetype,
                    isActive: true,
                    storageType: STORAGE_TYPE,
                },
            });

            uploadedImages.push(savedImage);
        } catch (error) {
            // Clean up file if upload fails
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }

    return uploadedImages;
};

const getAllImages = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } =
        formatQueryOptions(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.GalleryWhereInput[] = [];

    // Search functionality
    if (searchTerm) {
        andConditions.push({
            OR: gallerySearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // Filter functionality
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.GalleryWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.gallery.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : { createdAt: "desc" },
    });

    const total = await prisma.gallery.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getImageByIdFromDB = async (id: string) => {
    const result = await prisma.gallery.findUniqueOrThrow({
        where: {
            id,
        },
    });

    return result;
};

const updateImageByIdIntoDB = async (id: string, payload: any) => {
    await prisma.gallery.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.gallery.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};

const deleteImageFromDB = async (id: string) => {
    const imageToDelete = await prisma.gallery.findUniqueOrThrow({
        where: {
            id,
        },
    });

    // Delete from storage based on storage type
    if (
        imageToDelete.storageType === "cloudinary" &&
        imageToDelete.cloudinaryId
    ) {
        try {
            const cloudinary = require("cloudinary").v2;
            await cloudinary.uploader.destroy(imageToDelete.cloudinaryId);
        } catch (error) {
            console.error("Failed to delete from cloudinary:", error);
            // Continue with database deletion even if cloudinary deletion fails
        }
    } else if (
        imageToDelete.storageType === "local" &&
        imageToDelete.localPath
    ) {
        try {
            const filePath = path.join(
                process.cwd(),
                LOCAL_UPLOAD_PATH,
                imageToDelete.localPath
            );
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Failed to delete local file:", error);
            // Continue with database deletion even if file deletion fails
        }
    }

    const result = await prisma.gallery.delete({
        where: {
            id,
        },
    });

    return result;
};

const deleteMultipleImagesFromDB = async (ids: string[]) => {
    // Get images to delete for cleanup
    const imagesToDelete = await prisma.gallery.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
            cloudinaryId: true,
            localPath: true,
            storageType: true,
        },
    });

    // Delete from storage based on storage type
    for (const image of imagesToDelete) {
        if (image.storageType === "cloudinary" && image.cloudinaryId) {
            try {
                const cloudinary = require("cloudinary").v2;
                await cloudinary.uploader.destroy(image.cloudinaryId);
            } catch (error) {
                console.error(
                    `Failed to delete ${image.cloudinaryId} from cloudinary:`,
                    error
                );
                // Continue with other deletions
            }
        } else if (image.storageType === "local" && image.localPath) {
            try {
                const filePath = path.join(
                    process.cwd(),
                    LOCAL_UPLOAD_PATH,
                    image.localPath
                );
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error(
                    `Failed to delete local file ${image.localPath}:`,
                    error
                );
                // Continue with other deletions
            }
        }
    }

    // Delete from database
    const result = await prisma.gallery.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    return result;
};

export const GalleryService = {
    uploadImages,
    getAllImages,
    getImageByIdFromDB,
    updateImageByIdIntoDB,
    deleteImageFromDB,
    deleteMultipleImagesFromDB,
};
