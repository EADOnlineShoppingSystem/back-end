import oderServices from "../services/oder.services.js";
import axios from "axios";


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


const createOders =async (req,res)=>{
    try {
        const oders = req.body;
        const userID = req.user.id
        const newOders = await oderServices.createOder(oders,userID);
        console.log("newOders",newOders);
        res.status(201).json(newOders);
        
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}

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



export default { getAllOrders,createOders,getOdersByUserId};
