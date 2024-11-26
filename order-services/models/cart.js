import { Schema, model } from "mongoose";

const cart = new Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    quantity: { type: Number, required: true },
});

export default model('Cart', cart);
