import express from 'express'
import cartController from '../Controllers/cart.controller.js';
const cartRouter = express.Router();

cartRouter.get("/getCartsByuser/:userId",cartController.getCartDetailsByUserID);
cartRouter.post("/addtocart",cartController.addToCart);
cartRouter.delete("/deleteCart/:id",cartController.deleteCart);

export default cartRouter