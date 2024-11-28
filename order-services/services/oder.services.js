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
            console.log("address",address);
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
    const deleteAddressByUserId =async(AddressId)=>{
        try {
            return await Address.deleteOne({ _id: AddressId });
        } catch (error) {
            throw new Error("error deleting address")
        }
    }
const getAllOrdersAmountQuantityGivenMonthToToday = async () => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59); 
        
        const orders = await Order.find({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfToday,
            },
        });
        // Calculate the total amount and quantity
        const summary = orders.reduce(
            (acc, order) => {
                acc.totalAmount += order.price || 0; 
                acc.totalQuantity += order.quantity || 0;
                return acc;
            },
            { totalAmount: 0, totalQuantity: 0 }
        );

        console.log("Current Month:", now.getMonth() + 1);
        console.log("Order Summary:", summary);

        const allReturnData={
            ...summary,
            month: now.getMonth() + 1,
        }
        return allReturnData;
    } catch (error) {
        throw new Error(`Error calculating order summaries: ${error.message}`);
    }
};


export default { getAllOrdersServices,deleteAddressByUserId,createOder,getOdersByUserId,setAddress,getAddressById,getAddressCountByUserId,getAllOrdersAmountQuantityGivenMonthToToday }
