import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import router from "./app/router";

const app: Application = express();

app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ url: req.url, message: "App is running" });
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        status: false,
        message: "API NOT FOUND",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found.",
        },
    });
});

export default app;
