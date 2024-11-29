import Order from '../../models/oderModel.js';
import Address from '../../models/address.js';
import orderServices from '../../services/oder.services.js';

jest.mock('../../models/oderModel.js'); // Mock the Order model
jest.mock('../../models/address.js'); // Mock the Address model

describe('Order Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllOrdersServices', () => {
        test('should return all orders', async () => {
            const mockOrders = [
                { _id: "1", userId: "user1", productId: "product1" },
                { _id: "2", userId: "user2", productId: "product2" }
            ];
            Order.find.mockResolvedValue(mockOrders);

            const result = await orderServices.getAllOrdersServices();

            expect(Order.find).toHaveBeenCalled();
            expect(result).toEqual(mockOrders);
        });

        test('should throw an error when fetching orders fails', async () => {
            Order.find.mockRejectedValue(new Error("Database error"));

            await expect(orderServices.getAllOrdersServices()).rejects.toThrow("Error while fetching orders");
        });
    });

    describe('createOder', () => {
        test('should create a new order', async () => {
            const mockOrderData = { productId: "product1", quantity: 2, price: 100 };
            const mockSavedOrder = { ...mockOrderData, _id: "1", userId: "user1" };
            const saveMock = jest.fn().mockResolvedValue(mockSavedOrder);

            Order.mockImplementation(() => ({ save: saveMock })); // Mock the Order instance

            const result = await orderServices.createOder(mockOrderData, "user1");

            expect(Order).toHaveBeenCalledWith({ ...mockOrderData, userId: "user1" });
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(mockSavedOrder);
        });

        test('should throw an error if order creation fails', async () => {
            const mockOrderData = { productId: "product1", quantity: 2, price: 100 };
            const saveMock = jest.fn().mockRejectedValue(new Error("Save failed"));

            Order.mockImplementation(() => ({ save: saveMock }));

            await expect(orderServices.createOder(mockOrderData, "user1")).rejects.toThrow("error creating order");
        });
    });

    describe('getOdersByUserId', () => {
        test('should return orders for a given user ID', async () => {
            const mockOrders = [{ _id: "1", productId: "product1", userId: "user1" }];
            Order.find.mockResolvedValue(mockOrders);

            const result = await orderServices.getOdersByUserId("user1");

            expect(Order.find).toHaveBeenCalledWith({ userId: "user1" });
            expect(result).toEqual(mockOrders);
        });

        test('should throw an error if no orders are found', async () => {
            Order.find.mockResolvedValue([]);

            await expect(orderServices.getOdersByUserId("user1")).rejects.toThrow("No orders found for the given user ID");
        });

        test('should throw an error if fetching orders fails', async () => {
            Order.find.mockRejectedValue(new Error("Database error"));

            await expect(orderServices.getOdersByUserId("user1")).rejects.toThrow("cannot find oders by user,Database error");
        });
    });

    describe('setAddress', () => {
        test('should create and save a new address', async () => {
            const mockAddressData = { street: "123 Main St", city: "Metropolis" };
            const mockSavedAddress = { ...mockAddressData, _id: "1", userId: "user1" };
            const saveMock = jest.fn().mockResolvedValue(mockSavedAddress);

            Address.mockImplementation(() => ({ save: saveMock }));

            const result = await orderServices.setAddress("user1", mockAddressData);

            expect(Address).toHaveBeenCalledWith({ ...mockAddressData, userId: "user1" });
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(mockSavedAddress);
        });

        test('should throw an error if address creation fails', async () => {
            const mockAddressData = { street: "123 Main St", city: "Metropolis" };
            const saveMock = jest.fn().mockRejectedValue(new Error("Save failed"));

            Address.mockImplementation(() => ({ save: saveMock }));

            await expect(orderServices.setAddress("user1", mockAddressData)).rejects.toThrow("error creating Address");
        });
    });

    describe('getAddressById', () => {
        test('should return addresses for a given user ID', async () => {
            const mockAddresses = [{ street: "123 Main St", city: "Metropolis", userId: "user1" }];
            Address.find.mockResolvedValue(mockAddresses);

            const result = await orderServices.getAddressById("user1");

            expect(Address.find).toHaveBeenCalledWith({ userId: "user1" });
            expect(result).toEqual(mockAddresses);
        });

        test('should throw an error if fetching addresses fails', async () => {
            Address.find.mockRejectedValue(new Error("Database error"));

            await expect(orderServices.getAddressById("user1")).rejects.toThrow("error Fletchng Address");
        });
    });

    describe('getAddressCountByUserId', () => {
        test('should return the count of addresses for a given user ID', async () => {
            Address.find.mockReturnValue({
                countDocuments: jest.fn().mockResolvedValue(2)
            });

            const result = await orderServices.getAddressCountByUserId("user1");

            expect(Address.find).toHaveBeenCalledWith({ userId: "user1" });
            expect(result).toBe(2);
        });

        test('should throw an error if counting addresses fails', async () => {
            Address.find.mockReturnValue({
                countDocuments: jest.fn().mockRejectedValue(new Error("Database error"))
            });

            await expect(orderServices.getAddressCountByUserId("user1")).rejects.toThrow("Error while fetching address count");
        });
    });
});
