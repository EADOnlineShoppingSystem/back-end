import express from 'express'
import cartController from '../Controllers/cart.controller.js';
import authMiddleware from "../middleware/authMiddleware.js"
import cart from '../models/cart.js';
const cartRouter = express.Router();

cartRouter.get("/getCartsByuser",authMiddleware,cartController.getCartDetailsByUserID);
cartRouter.post("/addtocart",authMiddleware,cartController.addToCart);
cartRouter.delete("/deleteCart/:id",cartController.deleteCart);
cartRouter.get("/getAllQuantityByUsers",authMiddleware,cartController.getAllQuantityByUsers);
cartRouter.put("/UpdateCartQantity",cartController.updateCartQuantity);
export default cartRouter