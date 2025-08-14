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

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getCategoryById);

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    CategoryController.updateCategoryById
);

router.delete(
    "/:id",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    CategoryController.deleteCategory
);

export const CategoryRoutes = router;
