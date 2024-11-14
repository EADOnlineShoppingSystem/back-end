import Order from '../models/oderModel.js'

const getAllOrdersServices = async () => {
    try {
        return await Order.find();
    } catch (error) {
        throw new Error("Error while fetching orders"); 
    }
};

const createOder = async (oderData)=>{
    try {
        const newOder = new Order(oderData);
        return await newOder.save();
    } catch (error) {
        throw new Error("error creating order")
    }
}

const getOdersByUserId =async (userId)=>{
        
}
export default { getAllOrdersServices,createOder };
