import { Router } from "express";
import {
  createCart,
  findCartById,
  addProduct,
  deleteProduct,
  deleteProducts,
  updateAllProducts,
  updateQuantity,
  purchase,
} from "../controllers/cartsController.js";
import auth from "../middlewares/auth.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", findCartById);
router.post(
  "/:cid/product/:pid",
  auth,
  authorization("addProduct"),
  addProduct
);
router.delete(
  "/:cid/product/:pid",
  auth,
  authorization("deleteProduct"),
  deleteProduct
);
router.delete("/:cid", auth, authorization("deleteProducts"), deleteProducts);
router.put("/:cid", auth, updateAllProducts);
router.put(
  "/:cid/product/:pid",
  auth,
  authorization("updateQuantity"),
  updateQuantity
);
router.post("/:cid/purchase", auth, authorization("purchase"), purchase);

export default router;
