import express from "express";
import orderController from "../Controllers/oder.controller.js";
import oderController from "../Controllers/oder.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/allOrders", orderController.getAllOrders);
router.post("/createOrder",authMiddleware,oderController.createOders);
router.get("/getOdersByUserId/:userId",oderController.getOdersByUserId);
router.post("/setAddress",authMiddleware,oderController.createAddress);
router.get("/getAddressById",authMiddleware,oderController.getAddressById);
export default router;
