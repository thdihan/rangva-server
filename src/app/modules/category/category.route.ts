import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post(
    "/create",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    CategoryController.createCategory
);

export const CategoryRoutes = router;
