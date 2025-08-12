import { Response } from "express";

export const sendResponse = <T>(
    res: Response,
    jsonData: {
        status: number;
        success: boolean;
        message: string;
        meta?: {
            page?: number;
            limit?: number;
            total: number;
        };
        data?: T | null | undefined;
        error?: unknown;
    }
) => {
    if (jsonData.success === true) {
        res.status(jsonData.status).json({
            success: true,
            message: jsonData.message,
            meta: jsonData.meta,
            data: jsonData.data,
        });
    } else {
        res.status(jsonData.status).json({
            success: false,
            message: jsonData.message,
            meta: jsonData.meta,
            error: jsonData.error,
        });
    }
};
