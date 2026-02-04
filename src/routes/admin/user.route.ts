import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { authorizedMiddleWare } from "../../middlewares/authorized.middleware";
import { isAdminMiddleware } from "../../middlewares/isAdmin.middleware";
import { uploadProfilePic } from "../../middlewares/profilePic.middleware";

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
