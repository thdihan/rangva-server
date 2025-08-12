import express from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "./admin.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllAdmins
);
router.get(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAdminById
);
router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(AdminValidationSchema.update),
    AdminController.updateAdminById
);
router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.deleteAdmin
);
router.delete(
    "/soft/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.softDeleteAdmin
);

export const AdminRoutes = router;
