import { Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import { pick } from "../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import { paginationOptions } from "../../utils/formatQueryOptions";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

const getAllAdmins: RequestHandler = catchAsync(async (req, res) => {
    const pickedQuery = pick(req.query, adminFilterableFields);
    const options = pick(req.query, paginationOptions);
    console.log(
        "[LOG : admin.controller -> getAllAdmins()] Picked Query\n",
        pickedQuery
    );

    const result = await AdminService.getAllAdminsFromDB(pickedQuery, options);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admins fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getAdminById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await AdminService.getAdminByIdFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admin fetched successfully",
        data: result,
    });
});

const updateAdminById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await AdminService.updateAdminByIdIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admin updated successfully",
        data: result,
    });
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await AdminService.deleteAdminFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
});

const softDeleteAdmin: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await AdminService.softDeleteAdminFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
});

export const AdminController = {
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdmin,
    softDeleteAdmin,
};
