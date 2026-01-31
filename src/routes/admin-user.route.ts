import { Router } from "express";
import { AdminUserController } from "../controller/admin-user.controller";
import { authorizedMiddleWare } from "../middlewears/authorized.middleware";
import { isAdminMiddleware } from "../middlewears/isAdmin.middleware";
import { uploadProfilePic } from "../middlewears/profilePic.middleware";

const router = Router();
const adminUserController = new AdminUserController();

// All admin routes require authentication AND admin role
router.post(
    "/admin/users",
    authorizedMiddleWare,
    isAdminMiddleware,
    uploadProfilePic.single("profilePic"),
    adminUserController.createUser
);

router.get(
    "/admin/users",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminUserController.getAllUsers
);

router.get(
    "/admin/users/:id",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminUserController.getUserById
);

router.put(
    "/admin/users/:id",
    authorizedMiddleWare,
    isAdminMiddleware,
    uploadProfilePic.single("profilePic"),
    adminUserController.updateUser
);

router.delete(
    "/admin/users/:id",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminUserController.deleteUser
);

export default router;
