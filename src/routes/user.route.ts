import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";
import { uploadProfilePic } from "../middlewares/profilePic.middleware";


const router = Router();
const userController = new UserController();

// All user routes require authentication
router.get("/getAllUsers", authorizedMiddleWare, userController.getAllUsers);
router.get("/me/:uid", authorizedMiddleWare, userController.getUser);
router.get("/user/:uid", authorizedMiddleWare, userController.getUser);
router.put("/users/:uid", authorizedMiddleWare, userController.updateUser);
router.delete("/users/:uid", authorizedMiddleWare, userController.deleteUser);
router.post("/users/:uid/profile-pic", authorizedMiddleWare, uploadProfilePic.single("profilePic"), userController.uploadProfilePic);

// Verified deletion routes
router.delete("/users/:uid/delete-with-password", authorizedMiddleWare, userController.deleteUserWithPassword);
router.delete("/users/:uid/delete-with-google", authorizedMiddleWare, userController.deleteUserWithGoogle);

export default router;
