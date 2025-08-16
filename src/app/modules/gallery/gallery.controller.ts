import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { GalleryService } from "./gallery.service";
import { pick } from "../../utils/pick";
import { galleryFilterableFields } from "./gallery.constant";
import { paginationOptions } from "../../utils/formatQueryOptions";

const uploadImages = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const customNames = req.body.customNames
        ? JSON.parse(req.body.customNames)
        : {};

    if (!files || files.length === 0) {
        return sendResponse(res, {
            status: httpStatus.BAD_REQUEST,
            success: false,
            message: "No images provided",
            data: null,
        });
    }

    const result = await GalleryService.uploadImages(files, customNames);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: `${files.length} image(s) uploaded successfully`,
        data: result,
    });
});

const getAllImages: RequestHandler = catchAsync(async (req, res) => {
    const pickedQuery = pick(req.query, galleryFilterableFields);
    const options = pick(req.query, paginationOptions);

    const result = await GalleryService.getAllImages(pickedQuery, options);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Images fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getImageById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await GalleryService.getImageByIdFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Image fetched successfully",
        data: result,
    });
});

const updateImageById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await GalleryService.updateImageByIdIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Image updated successfully",
        data: result,
    });
});

const deleteImage: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await GalleryService.deleteImageFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Image deleted successfully",
        data: result,
    });
});

const deleteMultipleImages: RequestHandler = catchAsync(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendResponse(res, {
            status: httpStatus.BAD_REQUEST,
            success: false,
            message: "No image IDs provided",
            data: null,
        });
    }

    const result = await GalleryService.deleteMultipleImagesFromDB(ids);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: `${ids.length} image(s) deleted successfully`,
        data: result,
    });
});

export const GalleryController = {
    uploadImages,
    getAllImages,
    getImageById,
    updateImageById,
    deleteImage,
    deleteMultipleImages,
};
