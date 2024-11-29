import cartServices from "../../services/cart.services.js";
import cartController from "../../Controllers/cart.controller.js";
import axios from "axios";

jest.mock("../../services/cart.services.js"); // Mock cart services
jest.mock("axios"); // Mock Axios

describe("Cart Controller Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getCartDetailsByUserID should return cart details with product information", async () => {
        const mockCarts = [
            { _id: "cart1", productId: "product1", toObject: jest.fn().mockReturnValue({ _id: "cart1", productId: "product1" }) },
            { _id: "cart2", productId: "product2", toObject: jest.fn().mockReturnValue({ _id: "cart2", productId: "product2" }) }
        ];

        const mockProductResponse = { data: { id: "product1", name: "Product 1" } };

        cartServices.getCartByUserId.mockResolvedValue(mockCarts);
        axios.get.mockResolvedValue(mockProductResponse);

        const req = { user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.getCartDetailsByUserID(req, res);

        expect(cartServices.getCartByUserId).toHaveBeenCalledWith("user1");
        expect(axios.get).toHaveBeenCalledTimes(mockCarts.length);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    productDetails: mockProductResponse.data
                })
            ])
        );
    });

    test("getCartDetailsByUserID should return 404 if no carts are found", async () => {
        cartServices.getCartByUserId.mockResolvedValue([]);

        const req = { user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.getCartDetailsByUserID(req, res);

        expect(cartServices.getCartByUserId).toHaveBeenCalledWith("user1");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No carts found for this user." });
    });

    test("getCartDetailsByUserID should return 500 if an error occurs", async () => {
        cartServices.getCartByUserId.mockRejectedValue(new Error("Database error"));

        const req = { user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.getCartDetailsByUserID(req, res);

        expect(cartServices.getCartByUserId).toHaveBeenCalledWith("user1");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });

    test("addToCart should add a product to the cart and return 201", async () => {
        const mockCart = { _id: "cart1", productId: "product1", quantity: 1 };

        cartServices.addToCart.mockResolvedValue(mockCart);

        const req = { body: { productId: "product1", quantity: 1 }, user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.addToCart(req, res);

        expect(cartServices.addToCart).toHaveBeenCalledWith(req.body, "user1");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    test("addToCart should return 500 if an error occurs", async () => {
        cartServices.addToCart.mockRejectedValue(new Error("Failed to add to cart"));

        const req = { body: { productId: "product1", quantity: 1 }, user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.addToCart(req, res);

        expect(cartServices.addToCart).toHaveBeenCalledWith(req.body, "user1");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to add to cart" });
    });

    test("deleteCart should delete a cart and return 200", async () => {
        const mockResponse = { message: "Cart deleted successfully" };

        cartServices.deleteCart.mockResolvedValue(mockResponse);

        const req = { params: { id: "cart1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.deleteCart(req, res);

        expect(cartServices.deleteCart).toHaveBeenCalledWith("cart1");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    test("deleteCart should return 500 if an error occurs", async () => {
        cartServices.deleteCart.mockRejectedValue(new Error("Failed to delete cart"));

        const req = { params: { id: "cart1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await cartController.deleteCart(req, res);

        expect(cartServices.deleteCart).toHaveBeenCalledWith("cart1");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to delete cart" });
    });
});
