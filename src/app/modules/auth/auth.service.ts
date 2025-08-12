import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { JwtHelper } from "../../utils/jwtHelper";
import { UserStatus } from "../../../generated/prisma";
import config from "../../config";
import { emailSender } from "../../utils/emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const login = async (payload: { email: string; password: string }) => {
    console.log("[LOG : auth.service -> login()] Called");
    console.log("[LOG : auth.service -> login()] Payload\n", payload);

    const result = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    console.log("[LOG : auth.service -> login()] Result\n", result);

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.password,
        result.password
    );

    if (!isCorrectPassword) throw new Error("Password incorrect");

    const accessToken = JwtHelper.generateToken(
        {
            email: result.email,
            role: result.role,
        },
        config.jwt.secret as string,
        config.jwt.expires_in as string
    );

    const refreshToken = JwtHelper.generateToken(
        {
            email: result.email,
            role: result.role,
        },
        config.jwt.refresh_token_secret as string,
        config.jwt.refresh_token_expires_in as string
    );
    return {
        accessToken,
        needPasswordChange: result.needPasswordChange,
        refreshToken,
    };
};

const refreshToken = async (token: string) => {
    console.log("[LOG : auth.service -> refreshToken()] Called");
    console.log("[LOG : auth.service -> refreshToken()] Token\n", token);

    const decodedData = JwtHelper.verifyToken(token, "efgghh");

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE,
        },
    });

    const accessToken = JwtHelper.generateToken(
        {
            email: userData.email,
            role: userData.role,
        },
        config.jwt.secret as string,
        config.jwt.expires_in as string
    );
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
    };
};

const passwordChange = async (user: any, payload: any) => {
    console.log("[LOG : auth.service -> passwordChange()] Called");
    console.log("[LOG : auth.service -> passwordChange()] User", user);
    console.log("[LOG : auth.service -> passwordChange()] Payload", payload);
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE,
        },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );

    if (!isCorrectPassword) throw new Error("Password incorrect");

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    const updatedUser = await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });

    return {
        email: updatedUser.email,
        needPasswordChange: updatedUser.needPasswordChange,
    };
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE,
        },
    });

    const resetPasswordToken = JwtHelper.generateToken(
        {
            email: userData.email,
            role: userData.role,
            tokenType: "RESET",
        },
        config.jwt.reset_token_secret as string,
        config.jwt.reset_token_expires_in as string
    );
    console.log(
        "[LOG : auth.service -> resetPassword()] resetPasswordToken\n",
        resetPasswordToken
    );

    const resetLink =
        config.reset_password_link +
        `?userId=${userData.id}&token=${resetPasswordToken}`;

    console.log(
        "[LOG : auth.service -> resetPassword()] resetLink\n",
        resetLink
    );

    await emailSender(
        userData.email,
        `
            <html>
                <body>
                    <p>Dear XYZ,</p>
                    <p>Here is your link for password reset.</p>
                    <a href="${resetLink}" style="background: #000, color: #fff, padding: 10px 20px">Reset Password</a>
                </body>
            </html>
        `
    );
};

const resetPassword = async (token: string, payload: any) => {
    console.log("[LOG : auth.service -> resetPassword()] token", token);
    console.log("[LOG : auth.service -> resetPassword()] Payload", payload);
    const isValidToken = JwtHelper.verifyToken(
        token,
        config.jwt.reset_token_secret as string
    );

    if (!isValidToken) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized for this action."
        );
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE,
        },
    });

    console.log("[LOG : auth.service -> resetPassword()] userData", userData);

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    const updatedUser = await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        },
    });

    return {
        email: updatedUser.email,
        needPasswordChange: updatedUser.needPasswordChange,
    };
};
export const AuthService = {
    login,
    refreshToken,
    passwordChange,
    forgotPassword,
    resetPassword,
};
