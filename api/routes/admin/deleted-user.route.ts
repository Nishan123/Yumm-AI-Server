import { Router } from "express";
import { DeletedUserController } from "../../controllers/admin/deleted-user.controller";
import { authorizedMiddleWare } from "../../middlewares/authorized.middleware";
import { isAdminMiddleware } from "../../middlewares/isAdmin.middleware";

const router = Router();
const deletedUserController = new DeletedUserController();

router.get(
    "/admin/deleted-users",
    authorizedMiddleWare,
    isAdminMiddleware,
    deletedUserController.getAllDeletedUsers
);

export default router;
