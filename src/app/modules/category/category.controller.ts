import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";

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

export const CategoryController = {
    createCategory,
};
