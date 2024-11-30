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

const addToCart = async (cartData,userId)=>{
    try {
        const newCart =new cart({...cartData,userId:userId});
        return await newCart.save();
    } catch (error) {
        throw new Error("error creating cart")
    }
}
const deleteCart = async (cartId)=>{
    try {
        return await cart.findByIdAndDelete(cartId)
    } catch (error) {
        throw new Error("error deleting cart")
    }
}
const updateCartQuantity = async (cartId, newQuantity) => {
    try {

        if (newQuantity < 0) {
            throw new Error("Quantity cannot be negative");
        }
        const cartData = await cart.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        cartData.quantity = newQuantity;
        const updatedCart = await cartData.save();
        return updatedCart;
    } catch (error) {
        throw new Error(`Error updating cart: ${error.message}`);
    }
};

const findCartByUserIdAndProductId = async (userId, productId) => {
    
   const data = await cart.findOne({ userId, productId });
   console.log("data ",data)
    return data;
};
const getAllQuantityByUsers = async (userId) => {
    try {
        const cartData = await cart.find({ userId: userId });
        if (!cartData.length) {
            throw new Error("No cart found for the given user ID");
        }
        const totalQuantity = cartData.reduce((acc, cart) => acc + cart.quantity, 0);
        return totalQuantity;
    } catch (error) {
        throw new Error(`Cannot get total quantity by user: ${error.message}`);
    }
}

const deleteCartByUserId = async (userId) => {
    try {
        return await cart.deleteMany({ userId });
    } catch (error) {
        throw new Error(`Error deleting cart by user: ${error.message}`);
    }
}
export default {addToCart,getCartByUserId,deleteCart,getAllQuantityByUsers,updateCartQuantity,findCartByUserIdAndProductId,deleteCartByUserId}