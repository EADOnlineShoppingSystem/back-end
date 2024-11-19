import cartServices from "../services/cart.services.js"
const getCartDetailsByUserID = async (req,res)=>{

    try {
        const userID =req.params.userID
        const getCarts = await  cartServices.getCartByUserId(userID)
        res.status(200).json(getCarts)
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
}

const addToCart = async (req,res)=>{
    try {
        const cartData = req.body
        const addCart = await cartServices.addToCart(cartData)
        res.status(201).json(addCart)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export default {addToCart,getCartDetailsByUserID}