import express from 'express'
import cartController from '../Controllers/cart.controller.js';
const cartRouter = express.Router();

cartRouter.get("/getCartsByuser/:userId",cartController.getCartDetailsByUserID);
cartRouter.post("/addtocart",cartController.addToCart);

export default cartRouter