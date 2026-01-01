import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { authorizedMiddleWare } from "../middlewears/authorized.middleware";

const router = Router();
const authController = new AuthController();

router.post("/auth/register",authorizedMiddleWare, authController.register);
router.post("/auth/login",authorizedMiddleWare, authController.login);

export default router;
