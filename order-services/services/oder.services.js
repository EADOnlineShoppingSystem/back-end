import Order from '../models/oderModel.js'
import Address from "../models/address.js"

const getAllOrdersServices = async () => {
    try {
        return await Order.find();
    } catch (error) {
        throw new Error("Error while fetching orders"); 
    }
};

const createOder = async (oderData,userId)=>{
    try {
        const newOder = new Order({
            ...oderData,
            userId:userId});
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
const setAddress = async (userId, address) => {
    try {
        const newAddress = new Address({
            ...address,
            userId:userId});
            console.log("newAddress",newAddress);
        return await newAddress.save();
    } catch (error) {
        throw new Error("error creating Address")
    }
    }

    const getAddressById =async (userId)=>{
        try {
            const address = await Address.find({userId:userId});
            return address;

        } catch (error) {
             throw new Error("error Fletchng Address")
        }
    }
    const getAddressCountByUserId = async (userId) => {
        try {
            return await Address.find({ userId: userId }).countDocuments();
        } catch (error) {
            throw new Error("Error while fetching address count");
        }
    }

export default { getAllOrdersServices,createOder,getOdersByUserId,setAddress,getAddressById,getAddressCountByUserId }
