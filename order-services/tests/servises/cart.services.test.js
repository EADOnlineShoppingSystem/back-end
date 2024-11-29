import cart from '../../models/cart.js';
import cartServices from '../../services/cart.services.js';

jest.mock('../../models/cart.js'); // Mock the cart model

describe('Cart Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCartByUserId', () => {
        test('should return cart data for a given user ID', async () => {
            const mockCartData = [
                { _id: "1", userId: "user1", productId: "product1", quantity: 2 }
            ];
            cart.find.mockResolvedValue(mockCartData);

            const result = await cartServices.getCartByUserId("user1");

            expect(cart.find).toHaveBeenCalledWith({ userId: "user1" });
            expect(result).toEqual(mockCartData);
        });

        test('should throw an error if no cart data is found for a given user ID', async () => {
            cart.find.mockResolvedValue([]);

            await expect(cartServices.getCartByUserId("user1")).rejects.toThrow(
                "No cart found for the given user ID"
            );
        });

        test('should throw an error if fetching cart data fails', async () => {
            cart.find.mockRejectedValue(new Error("Database error"));

            await expect(cartServices.getCartByUserId("user1")).rejects.toThrow(
                "cannot find cart by user,Database error"
            );
        });
    });

    describe('addToCart', () => {
        test('should add an item to the cart successfully', async () => {
            const mockCartData = { productId: "product1", quantity: 2 };
            const mockSavedCart = { ...mockCartData, _id: "1", userId: "user1" };
            const saveMock = jest.fn().mockResolvedValue(mockSavedCart);

            cart.mockImplementation(() => ({ save: saveMock }));

            const result = await cartServices.addToCart(mockCartData, "user1");

            expect(cart).toHaveBeenCalledWith({ ...mockCartData, userId: "user1" });
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCart);
        });

        test('should throw an error if adding to cart fails', async () => {
            const mockCartData = { productId: "product1", quantity: 2 };
            const saveMock = jest.fn().mockRejectedValue(new Error("Save failed"));

            cart.mockImplementation(() => ({ save: saveMock }));

            await expect(cartServices.addToCart(mockCartData, "user1")).rejects.toThrow(
                "error creating cart"
            );
        });
    });

    describe('deleteCart', () => {
        test('should delete a cart item by its ID successfully', async () => {
            const mockDeletedCart = { _id: "1", userId: "user1", productId: "product1" };
            cart.findByIdAndDelete.mockResolvedValue(mockDeletedCart);

            const result = await cartServices.deleteCart("1");

            expect(cart.findByIdAndDelete).toHaveBeenCalledWith("1");
            expect(result).toEqual(mockDeletedCart);
        });

        test('should throw an error if deleting the cart fails', async () => {
            cart.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));

            await expect(cartServices.deleteCart("1")).rejects.toThrow("error deleting cart");
        });
    });
});
