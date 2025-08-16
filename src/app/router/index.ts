import express from "express";
import { UserRoute } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { GalleryRoutes } from "../modules/gallery/gallery.route";

const router = express.Router();

const routeList = [
    {
        path: "/user",
        route: UserRoute,
    },
    {
        path: "/admin",
        route: AdminRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },

    {
        path: "/category",
        route: CategoryRoutes,
    },
    {
        path: "/gallery",
        route: GalleryRoutes,
    },
];

routeList.forEach((item) => router.use(item.path, item.route));

export default router;
