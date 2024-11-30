import { Schema, model } from "mongoose";

const address = new Schema({
    userId: { type: String, required: true },
    name : { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault:{type:Boolean,default:false},
    isProfessional:{type:Boolean,default:false}
});
 
export default model('Address', address);
