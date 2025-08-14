import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";
import { pick } from "../../utils/pick";
import { categoryFilterableFields } from "./category.constant";
import { paginationOptions } from "../../utils/formatQueryOptions";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req.body);

    console.log(
        "[LOG : category.controller -> createCategory()] Result\n",
        result
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});

const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
    const pickedQuery = pick(req.query, categoryFilterableFields);
    const options = pick(req.query, paginationOptions);
    console.log(
        "[LOG : category.controller -> getAllCategories()] Picked Query\n",
        pickedQuery
    );

    const result = await CategoryService.getAllCategory(pickedQuery, options);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Categories fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getCategoryById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await CategoryService.getCategoryByIdFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Category fetched successfully",
        data: result,
    });
});

const updateCategoryById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await CategoryService.updateCategoryByIdIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});

const deleteCategory: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await CategoryService.deleteCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
});

export const CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategory,
};
