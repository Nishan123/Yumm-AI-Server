import { Router } from "express";
import { ShoppingListController } from "../controllers/shopping-list.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const shoppingListController = new ShoppingListController();

router.post("/shopping-list", authorizedMiddleWare, shoppingListController.addItem);
router.get("/shopping-list", authorizedMiddleWare, shoppingListController.getItems);
router.put("/shopping-list/:itemId", authorizedMiddleWare, shoppingListController.updateItem);
router.delete("/shopping-list/:itemId", authorizedMiddleWare, shoppingListController.deleteItem);

export default router;
