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
const createMultipleOders = async (oders, userId) => {
    try {
        const newOders = oders.map((order) => ({
            ...order,
            userId,
        }));
        return await Order.insertMany(newOders);
    } catch (error) {
        throw new Error("Error creating multiple orders");
    }
}
const getDeliverystatusTrueSince1monthByuserId = async () => {
    try {
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const orders = await Order.find({
            userId: userId,
            deliveryStatus: true,
            createdAt: { $gte: oneMonthAgo },
        });
        return orders;

    } catch (error) {
        throw new Error("Error fetching orders");
    }
}
const deleverdStatusChangetoTrue = async (orderId) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate( orderId, { $set: { delevered: true } }, { new: true, runValidators: true });
        return updatedOrder;
} catch (error) {
    throw new Error("Error updating order");
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
const updateAddressByAddressId = async (address) => {
    try {
        const { _id, ...addressData } = address;
        if (!_id || Object.keys(addressData).length === 0) {
            throw new Error("AddressId and address data are required");
        }
        console.log("addressData",address._id);
        const updatedAddress = await Address.findByIdAndUpdate(
            _id,
            { $set: addressData },
            { new: true, runValidators: true }
        );
        if (!updatedAddress) {
            throw new Error("Address not found or update failed");
        }
        return updatedAddress;
    } catch (error) {
        console.error("Error updating address:", error.message);
        throw new Error("Error updating address");
    }
};


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

const getLastTenDaysOrdersCount = async () => {
    try {
        const now = new Date();
        const lastTenDays = [];

        // Loop through the last 10 days
        for (let i = 0; i < 10; i++) {
            const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - i,
                0,
                0,
                0
            );
            const endOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - i,
                23,
                59,
                59
            );

            // Fetch order count for the specific day
            const orderCount = await Order.find({
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            }).countDocuments();

            // Add the data for the day to the results
            lastTenDays.push({
                day: `Day ${10 - i}`, 
                date: startOfDay.toISOString().split('T')[0],
                orders: orderCount,
            });
        }

        return lastTenDays.reverse(); // Reverse to have Day 1 as the latest day
    } catch (error) {
        throw new Error(`Error fetching order counts: ${error.message}`);
    }
};




export default { getAllOrdersServices,deleteAddressByUserId,createOder,getOdersByUserId,setAddress,getAddressById,getAddressCountByUserId,updateAddressByAddressId,getAllOrdersAmountQuantityGivenMonthToToday ,getLastTenDaysOrdersCount,createMultipleOders,getDeliverystatusTrueSince1monthByuserId,deleverdStatusChangetoTrue}
