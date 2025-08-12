import { Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import { uploadToCloud } from "../../middlewares/uploadToCloud";
import { UploadApiResponse } from "cloudinary";
import { catchAsync } from "../../utils/catchAsync";
import { pick } from "../../utils/pick";
import { userFilterableFields, userSearchableFields } from "./user.constant";
import { paginationOptions } from "../../utils/formatQueryOptions";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TAuthUser } from "../../interface/common";

const createAdmin = async (req: Request, res: Response) => {
    console.log("[LOG : user.controller -> createAdmin() ] Called");
    console.log("[LOG : user.controller -> createAdmin() ] file", req.file);
    console.log("[LOG : user.controller -> createAdmin() ] data", req.body);

    // Upload image file
    if (req.file) {
        const uploadedImage: UploadApiResponse | undefined =
            await uploadToCloud(req.file);
        req.body.admin.profilePhoto = uploadedImage?.secure_url;
        console.log(
            "[LOG : user.controller -> createAdmin() ] uploadedImage",
            uploadedImage
        );
    }

    const result = await UserService.createAdminIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
};

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
    const pickedQuery = pick(req.query, userFilterableFields);
    const options = pick(req.query, paginationOptions);
    console.log(
        "[LOG : user.controller -> getAllUser()] Picked Query\n",
        pickedQuery
    );

    const result = await UserService.getAllUsersFromDB(pickedQuery, options);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admins fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});

const changeUserStatus: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await UserService.changeUserStatus(id, req.body.status);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "User status changed successfully",
        data: result,
    });
});

const getMyProfile = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
        const user = req.user;

        console.log("[LOG : user.controller -> getMyProfile()] user\n", user);

        const result = await UserService.getMyProfile(user as TAuthUser);
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Profile fetched successfully",
            data: result,
        });
    }
);
const updateMyProfile = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
        const user = req.user;

        console.log(
            "[LOG : user.controller -> updateMyProfile()] user\n",
            user
        );
        console.log(
            "[LOG : user.controller -> getMyProfile()] file\n",
            req.file
        );

        if (req.file) {
            const uploadedImage: UploadApiResponse | undefined =
                await uploadToCloud(req.file);
            req.body.profilePhoto = uploadedImage?.secure_url;
            console.log(
                "[LOG : user.controller -> getMyProfile() ] uploadedImage",
                uploadedImage
            );
        }

        console.log(
            "[LOG : user.controller -> updateMyProfile()] data\n",
            req.body
        );
        const result = await UserService.updateMyProfile(
            user as TAuthUser,
            req.body
        );
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Profile updated successfully",
            data: result,
        });
    }
);

export const UserController = {
    createAdmin,
    getAllUser,
    changeUserStatus,
    getMyProfile,
    updateMyProfile,
};
