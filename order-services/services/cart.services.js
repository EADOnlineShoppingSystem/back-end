import cart from '../models/cart.js'

const getCartByUserId =async(userId)=>{
    try {
        const cartData =await cart.find({ userId: userId })
        if (!cartData.length) {
            throw new Error("No cart found for the given user ID");
        }
        return cartData;
        
    } catch (error) {
        throw new Error(`cannot find cart by user,${error.message}`)
    }
}

const addToCart = async (cartData)=>{
    try {
        const newCart =new cart(cartData);
        return await newCart.save();
    } catch (error) {
        throw new Error("error creating cart")
    }
}
export default {addToCart,getCartByUserId}