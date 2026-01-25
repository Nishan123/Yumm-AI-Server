import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { authorizedMiddleWare } from "../middlewears/authorized.middleware";
import { uploadProfilePic } from "../middlewears/upload.middleware";

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.get("/getAllUsers", authorizedMiddleWare, userController.getAllUsers);
router.get("/me/:uid", authorizedMiddleWare, userController.getUser);
router.get("/user/:uid", authorizedMiddleWare, userController.getUser);
router.put("/users/:uid", authorizedMiddleWare, userController.updateUser);
router.delete("/users/:uid", authorizedMiddleWare, userController.deleteUser);
router.post("/users/:uid/profile-pic", authorizedMiddleWare, uploadProfilePic.single("profilePic"), userController.uploadProfilePic);

export default router;
