import express from "express";
import orderController from "../Controllers/oder.controller.js";
import oderController from "../Controllers/oder.controller.js";

const router = express.Router();

router.get("/allOrders", orderController.getAllOrders);
router.post("/createOrder",oderController.createOders);
router.get("/getOdersByUserId/:userId",oderController.getOdersByUserId)
export default router;