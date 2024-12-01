import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    addressId: { type: String, required: true },
    delevered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default model('Order', orderSchema);
