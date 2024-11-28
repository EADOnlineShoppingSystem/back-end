import { Schema, model } from "mongoose";

const address = new Schema({
    userId: { type: String, required: true },
    lane1 : { type: String, required: true },
    lane2: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postCode: { type: Number, required: true },
    phoneNo: { type: String, required: true }
});

export default model('Address', address);
