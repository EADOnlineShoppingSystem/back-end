import cartServices from "../services/cart.services.js"
import axios from "axios";
const getCartDetailsByUserID = async (req, res) => {
    try {
        const userID = req.user.id;
        const getCarts = await cartServices.getCartByUserId(userID);
console.log("getCarts",getCarts);
        if (!getCarts || getCarts.length === 0) {
            return res.status(404).json({ message: "No carts found for this user." });
        }

        const cartDetailsPromise = getCarts.map(async (cart) => {
            try {
                console.log("cart",cart.productId);
                 const productDetails = await axios.get(`http://localhost:3500/Product/api/products/product/674195cbc36bd2ccee6e1205`);

                return {
                    ...cart.toObject(),
                    productDetails: productDetails.data,
        
                };
            } catch (error) {
                return {
                    ...cart.toObject(),
                    productDetails: null,
                };
            }
        });

        const cartsWithProducts = await Promise.all(cartDetailsPromise);

        res.status(200).json(cartsWithProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addToCart = async (req,res)=>{
    try {
        const cartData = req.body
        const userId = req.user.id
        const addCart = await cartServices.addToCart(cartData,userId)
        res.status(201).json(addCart)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const deleteCart = async (req,res)=>{
    try {
        const cartId = req.params.id
        const deleteCart = await cartServices.deleteCart(cartId)
        res.status(200).json(deleteCart)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export default {addToCart,getCartDetailsByUserID,deleteCart}