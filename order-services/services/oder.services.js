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
        console.log("newOder",newOder);
        return await newOder.save();
    } catch (error) {
        throw new Error("error creating order")
    }
}

const getOdersByUserId =async (userId)=>{
        try {
            const orders = await Order.find({ userId: userId });
        if (!orders.length) {
            throw new Error("No orders found for the given user ID");
        }
        return orders;
        } catch (error) {
            throw new Error(`cannot find oders by user,${error.message}`)
        }
}
export default { getAllOrdersServices,createOder,getOdersByUserId };
