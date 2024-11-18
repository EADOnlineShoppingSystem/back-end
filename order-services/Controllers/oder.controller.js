import oderServices from "../services/oder.services.js";
import orderServices from "../services/oder.services.js";
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderServices.getAllOrdersServices();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOders =async (req,res)=>{
    try {
        const oders = req.body;
        console.log("data",oders);
        const newOders = await orderServices.createOder(oders);
        res.status(201).json(newOders);
        
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}

const getOdersByUserId =async (req,res)=>{
    try {
        const userId= req.params.userId
        console.log(userId)
        console.log("userId",typeof userId)
        const oderData = await oderServices.getOdersByUserId(userId);
        console.log(oderData)
        res.status(200).json(oderData)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export default { getAllOrders,createOders,getOdersByUserId};
