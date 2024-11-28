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
//delete address by addressId
router.delete("/deleteAddress/:addressId",oderController.deleteAddressByUserId)
//get Amounts in last month totaly revenue and total orders
router.get("/getAmountLastMonth",oderController.getAmountsAndCountsForMonth)
//total oders count in last 10 days
router.get("/getOdersCountLast10Days",oderController.getOdersCountLast10Days)
export default router;
