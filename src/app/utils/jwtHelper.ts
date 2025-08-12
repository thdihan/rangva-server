import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const generateToken = (
    payload: string | object | Buffer,
    secret: string,
    expiresIn: string
) => {
    const options: SignOptions = {
        algorithm: "HS256",
        expiresIn: expiresIn as SignOptions["expiresIn"],
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};

const verifyToken = (token: string, secret: Secret) => {
    let decodedData;
    try {
        decodedData = jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!!!"
        );
    }

    return decodedData;
};

export const JwtHelper = {
    generateToken,
    verifyToken,
};
