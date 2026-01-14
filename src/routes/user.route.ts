import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { authorizedMiddleWare } from "../middlewears/authorized.middleware";

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.get("/getAllUsers", authorizedMiddleWare, userController.getAllUsers);
router.get("/users/:uid", authorizedMiddleWare, userController.getUser);
router.put("/users/:uid", authorizedMiddleWare, userController.updateUser);
router.delete("/users/:uid", authorizedMiddleWare, userController.deleteUser);

export default router;
