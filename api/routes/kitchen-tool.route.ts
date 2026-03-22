import { Router } from "express";
import { KitchenToolController } from "../controllers/kitchen-tool.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const kitchenToolController = new KitchenToolController();

router.post("/kitchen-tools", authorizedMiddleWare, kitchenToolController.saveTool);
router.get("/kitchen-tools/:userId", authorizedMiddleWare, kitchenToolController.getTools);
router.delete("/kitchen-tools/:userId/:toolId", authorizedMiddleWare, kitchenToolController.deleteTool);

export default router;
