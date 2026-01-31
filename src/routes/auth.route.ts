import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { authorizedMiddleWare } from "../middlewears/authorized.middleware";
import { uploadProfilePic } from "../middlewears/profilePic.middleware";

const router = Router();
const authController = new AuthController();

// Auth routes are public - no middleware required
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/google", authController.googleLogin);

// Authenticated user profile update
router.put(
    "/auth/:id",
    authorizedMiddleWare,
    uploadProfilePic.single("profilePic"),
    authController.updateAuthUser
);

export default router;

