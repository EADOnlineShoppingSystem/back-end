import oderServices from "../services/oder.services.js";
import axios from "axios";

//get All Orders 
const getAllOrders = async (req, res) => {
    try {
        const orders = await oderServices.getAllOrdersServices();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        const detailedOrdersPromises = orders.map(async (order) => {
            try {
            console.log("order",order.userId);
               const productDetails = await axios.get(`http://localhost:3500/Product/api/products/product/${order.productId}`);
                const userDetails = await axios.get(`http://localhost:3500/User/api/users/user/${order.userId}`);
             console.log("productDetails",userDetails);

                return {
                    ...order.toObject(),
                    productDetails: productDetails.data,
                     userDetails: userDetails.data,
                };
            } catch (error) {
                console.error(`Error fetching details for order ID ${order._id}:`, error.message);
                return {
                    ...order.toObject(),
                    productDetails: null,
                    userDetails: null,
                };
            }
        });

        const detailedOrders = await Promise.all(detailedOrdersPromises);

        res.status(200).json(detailedOrders);
    } catch (error) {
        console.error("Error in getAllOrders:", error.message);
        res.status(500).json({ message: error.message });
    }
};

//create Oders
const createOders =async (req,res)=>{
    try {
        const oders = req.body;
        const userID = req.user.id
        const newOders = await oderServices.createOder(oders,userID);
        res.status(201).json(newOders);
        
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}
//get Oders By User Id
const getOdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const oderData = await oderServices.getOdersByUserId(userId);
        const cleanedOderData = oderData.map(order => order.toObject());

        if (!cleanedOderData || cleanedOderData.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }
        const productDetailsPromises = cleanedOderData.map(async (order) => {
            try {
                const productResponse = await axios.get(`http://localhost:3500/Product/api/products/product/${order.productId}`);
                return { ...order, productDetails: productResponse.data };
            } catch (error) {
                console.error(`Error fetching product details for ID ${order.productId}:`, error.message);
                return { ...order, productDetails: null }; 
            }
        });

        const ordersWithProducts = await Promise.all(productDetailsPromises);

        res.status(200).json(ordersWithProducts);
    } catch (error) {
        console.error("Error in getOdersByUserId:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const createAddress =async (req,res)=>{
    try {
        const userID =req.user.id;
        const address = req.body;
        const addressCount = await oderServices.getAddressCountByUserId(userID);
        if (addressCount <2) {
             const newAddress = await oderServices.setAddress(userID,address)
             res.status(201).json(newAddress);
        }
        else{
            res.status(400).json({message:"You can not add more than 2 address"});
        }
      
}
    catch (error) {
        console.log("error in createAddress",error.message);
        res.status(500).json({message:error.message});
    }
}
//Get Addresss By User Id
const getAddressById =async (req,res)=>{
    try{
        const userID = req.user.id;
        const address= await oderServices.getAddressById(userID);
        console.log("address",address);
        res.status(200).json(address);

    }catch(error){
        console.log("error in getAddressById",error.message);
        res.status(500).json({message:error.message});
}}

const deleteAddressByUserId =async (req,res)=>{
    try {
        const addressId = req.params.addressId;
        console.log("addressId",addressId);
        const address = await oderServices.deleteAddressByUserId(addressId);
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}
////Admin Parts 


const getAmountsAndCountsForMonth = async (req, res) => {
    try {
        const Amounts= await oderServices.getLastTenDaysOrdersCount();
        res.status(200).json(Amounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOdersCountLast10Days = async (req, res) => {
    try {
        const Amounts= await oderServices.getLastTenDaysOrdersCount();
        res.status(200).json(Amounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export default { getAllOrders,createOders,getOdersByUserId,createAddress,deleteAddressByUserId,getAddressById,getOdersCountLast10Days,getAmountsAndCountsForMonth };
