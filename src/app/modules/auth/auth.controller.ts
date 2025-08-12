import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        secure: false,
        httpOnly: true,
    });

    console.log("[LOG : auth.controller -> login()] Result\n", result);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange,
        },
    });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    console.log("[LOG : auth.controller -> refreshToken()] Result\n", result);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Logged in successfully",
        data: result,
    });
});

const passwordChange = catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
        console.log("[LOG : auth.controller -> passwordChange()] Called");
        const result = await AuthService.passwordChange(req.user, req.body);

        console.log(
            "[LOG : auth.controller -> passwordChange()] Result\n",
            result
        );
        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: "Password Changed successfully",
            data: result,
        });
    }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Password reset link generated.",
        data: result,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";
    console.log("[LOG : auth.controller -> resetPassword()] token\n", token);

    const result = await AuthService.resetPassword(token, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Password reseted.",
        data: result,
    });
});

export const AuthController = {
    login,
    refreshToken,
    passwordChange,
    forgotPassword,
    resetPassword,
};
