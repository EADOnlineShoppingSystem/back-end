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

export default { getAllOrders,createOders };
