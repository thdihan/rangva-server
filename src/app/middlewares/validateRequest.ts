import { RequestHandler } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
    (schema: AnyZodObject): RequestHandler =>
    async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
            });
            next();
        } catch (error) {
            next(error);
        }
    };
