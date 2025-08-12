import { rejects } from "assert";
import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from "cloudinary";
import fs from "fs";

export const uploadToCloud = async (file: any) => {
    // Configuration
    cloudinary.config({
        cloud_name: "dsbyacq3n",
        api_key: "331812385932473",
        api_secret: "5o2nvpGmHdJ3Y5lrRvtSWy75APQ", // Click 'View API Keys' above to copy your API secret
    });
    return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
        const uploadResult = cloudinary.uploader.upload(
            file.path,
            {
                public_id: file.originalName,
            },
            (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined
            ) => {
                fs.unlinkSync(file.path);
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};
