import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";
import { uploadProfilePic } from "../middlewares/profilePic.middleware";

const router = Router();
const authController = new AuthController();

// Auth routes are public - no middleware required
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/google", authController.googleLogin);
router.post("/auth/forgot-password", authController.sendResetPasswordEmail);
router.post("/auth/reset-password/:token", authController.resetPassword);

// Authenticated user profile update
router.put(
    "/auth/:id",
    authorizedMiddleWare,
    uploadProfilePic,
    authController.updateAuthUser
);

export default router;

