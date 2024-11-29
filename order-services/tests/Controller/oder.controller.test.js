import oderServices from "../../services/oder.services.js";
import oderController from "../../Controllers/oder.controller.js";
import axios from "axios";

import {
    createOders,
    getAllOrders,
    getOdersByUserId,
    createAddress,
    getAddressById
} from "../../Controllers/oder.controller.js";

jest.mock("../../services/oder.services.js");
jest.mock("axios");

describe("Order Controller Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getAllOrders should return all orders with product and user details", async () => {
        const mockOrders = [
            { _id: "1", userId: "user1", productId: "product1", quantity: 1, price: 100 },
            { _id: "2", userId: "user2", productId: "product2", quantity: 2, price: 200 }
        ];

        const mockProductResponse = { data: { name: "Product 1", price: 100 } };
        const mockUserResponse = { data: { name: "User 1", email: "user1@example.com" } };

        oderServices.getAllOrdersServices.mockResolvedValue(mockOrders);
        axios.get.mockImplementation((url) => {
            if (url.includes("Product")) return Promise.resolve(mockProductResponse);
            if (url.includes("User")) return Promise.resolve(mockUserResponse);
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.getAllOrders(req, res);

        expect(oderServices.getAllOrdersServices).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledTimes(4); // Two product and two user requests
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                productDetails: mockProductResponse.data,
                userDetails: mockUserResponse.data
            })
        ]));
    });

    test("getAllOrders should return 404 if no orders are found", async () => {
        oderServices.getAllOrdersServices.mockResolvedValue([]);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.getAllOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No orders found." });
    });

    test("createOders should create a new order and return 201", async () => {
        const mockOrder = { _id: "1", productId: "product1", userId: "user1", quantity: 1, price: 100 };
        oderServices.createOder.mockResolvedValue(mockOrder);

        const req = { body: mockOrder, user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.createOders(req, res);

        expect(oderServices.createOder).toHaveBeenCalledWith(mockOrder, "user1");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    test("createOders should return 500 if an error occurs", async () => {
        oderServices.createOder.mockRejectedValue(new Error("Database error"));

        const req = { body: { productId: "product1", quantity: 1, price: 100 }, user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.createOders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });

    test("createAddress should create an address if under the limit", async () => {
        const mockAddress = { street: "123 Main St", city: "Metropolis" };
        oderServices.getAddressCountByUserId.mockResolvedValue(1);
        oderServices.setAddress.mockResolvedValue(mockAddress);

        const req = { user: { id: "user1" }, body: mockAddress };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.createAddress(req, res);

        expect(oderServices.getAddressCountByUserId).toHaveBeenCalledWith("user1");
        expect(oderServices.setAddress).toHaveBeenCalledWith("user1", mockAddress);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockAddress);
    });

    test("createAddress should return 400 if the address limit is reached", async () => {
        oderServices.getAddressCountByUserId.mockResolvedValue(2);

        const req = { user: { id: "user1" }, body: { street: "123 Main St" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.createAddress(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "You can not add more than 2 address" });
    });

    test("getAddressById should return an address for a given user", async () => {
        const mockAddress = { street: "123 Main St", city: "Metropolis" };
        oderServices.getAddressById.mockResolvedValue(mockAddress);

        const req = { user: { id: "user1" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await oderController.getAddressById(req, res);

        expect(oderServices.getAddressById).toHaveBeenCalledWith("user1");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAddress);
    });
});
