const request = require('supertest');
const express = require('express');
const router = require('../../routes/productRoutes'); // Update the path to your router file
const Category = require('../../models/Category');
const Product = require('../../models/Product');

jest.mock('../../models/Category');     
jest.mock('../../models/Product');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Routes Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /add-category', () => {
    it('should add a new product successfully', async () => {
        // Mock category data for finding a category
        const mockCategory = { name: 'IPhone' };
      
        // Mock product data, which the save method will resolve to
        const mockProduct = {
          _id: '67499613cb686d8b44eec557',
          categoryName: 'IPhone',
          productTitle: 'I phone 15 Pro Max',
          productDescription: 'Good',
          lowestPrice: 345234,
          largestPrice: 456789,
          quantity: 32,
          tag: 'cv',
          warranty: '3',
          storages: ['128GB', '256GB'],
          colors: ['Silver', 'Black'],
          images: [
            { url: 'path/to/image1.jpg', public_id: 'image1' },
            { url: 'path/to/image2.jpg', public_id: 'image2' },
            { url: 'path/to/image3.jpg', public_id: 'image3' },
            { url: 'path/to/image4.jpg', public_id: 'image4' },
          ],
          createdAt: '2024-11-29T10:23:15.590+00:00',
          __v: 0,
          save: jest.fn().mockResolvedValue(true), // Mock the save method to resolve successfully
        };
      
        // Mock the behavior of Category.findOne to return the mock category
        Category.findOne.mockResolvedValue(mockCategory);
      
        // Mock the behavior of Product.prototype.save to return the mock product on save
        Product.prototype.save = jest.fn().mockResolvedValue(mockProduct);
      
        // Simulate the file upload using Buffer to mock image uploads
        const response = await request(app)
          .post('/api/add-product')
          .field('categoryName', 'IPhone')
          .field('productTitle', 'I phone 15 Pro Max')
          .field('productDescription', 'Good')
          .field('lowestPrice', '345234')
          .field('largestPrice', '456789')
          .field('quantity', '32')
          .field('tag', 'cv')
          .field('warranty', '3')
          .field('storages[]', '128GB') // Pass each array element separately
          .field('storages[]', '256GB')
          .field('colors[]', 'Silver') // Pass each array element separately
          .field('colors[]', 'Black')
          .attach('images', Buffer.from('image1'), 'image1.jpg') // Mock image uploads
          .attach('images', Buffer.from('image2'), 'image2.jpg')
          .attach('images', Buffer.from('image3'), 'image3.jpg')
          .attach('images', Buffer.from('image4'), 'image4.jpg');
      
        // Validate that the response has the correct status code and message
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Product added successfully.');
        expect(Product.prototype.save).toHaveBeenCalled(); // Ensure the save method was called
        expect(Category.findOne).toHaveBeenCalledWith({ name: 'IPhone' }); // Verify the category search was performed
      });
      

      
      

it('should return 500 if there is an error when adding a category', async () => {
  // Mocking the behavior to simulate an error during category creation
  Category.findOne.mockResolvedValue(null); // No existing category
  Category.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

  // Simulate the API request to add a category
  const response = await request(app)
    .post('/api/add-category')
    .field('name', 'Electronics')
    .attach('image', Buffer.from('test'), 'test.jpg'); // Mock file upload

  // Assert that the response status is 500 (Internal Server Error)
  expect(response.status).toBe(500);
  expect(response.body.message).toBe('Server error.');
  expect(Category.prototype.save).toHaveBeenCalled();
});

      

    it('should return error if category already exists', async () => {
      Category.findOne.mockResolvedValue({ name: 'Electronics' });

      const response = await request(app)
        .post('/api/add-category')
        .field('name', 'Electronics');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Category already exists.');
    });
  });

  describe('PUT /update-category/:categoryId', () => {
    it('should update a category successfully', async () => {
      const mockCategory = { name: 'Old Name', save: jest.fn().mockResolvedValue(true) };
      Category.findById.mockResolvedValue(mockCategory);

      const response = await request(app)
        .put('/api/update-category/1')
        .field('name', 'New Name');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Category updated successfully.');
      expect(mockCategory.save).toHaveBeenCalled();
    });

    it('should return error if category is not found', async () => {
      Category.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/update-category/1')
        .field('name', 'New Name');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found.');
    });
  });

  describe('POST /add-product', () => {
    it('should add a new product successfully', async () => {
      const mockCategory = { name: 'IPhone' };
      const mockProduct = { productTitle: 'I phone 15 Pro Max', save: jest.fn().mockResolvedValue(true) };
      Category.findOne.mockResolvedValue(mockCategory);
      Product.prototype.save = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/api/add-product')
        .field('categoryName', 'IPhone')
        .field('productTitle', 'I phone 15 Pro Max')
        .attach('images', Buffer.from('test'), 'test.jpg'); // Mock image upload

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product added successfully.');
      expect(Product.prototype.save).toHaveBeenCalled();
    });

    it('should return error if category is not found', async () => {
      Category.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/add-product')
        .field('categoryName', 'InvalidCategory')
        .field('productTitle', 'Laptop');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found.');
    });
  });

  describe('GET /categories', () => {
    it('should fetch all categories', async () => {
      const mockCategories = [{ name: 'Electronics' }, { name: 'Clothing' }];
      Category.find.mockResolvedValue(mockCategories);

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body.categories).toEqual(mockCategories);
    });
  });

  describe('GET /getProducts/:categoryName', () => {
    it('should fetch products by category name', async () => {
      const mockProducts = [{ productTitle: 'Laptop' }, { productTitle: 'Tablet' }];
      Product.find.mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/getProducts/Electronics');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
    });

    it('should return error if no products found', async () => {
      Product.find.mockResolvedValue([]);

      const response = await request(app).get('/api/getProducts/Electronics');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No products found for this category.');
    });
  });

  describe('GET /product/:productId', () => {
    it('should fetch product details by ID', async () => {
      const mockProduct = { productTitle: 'Laptop' };
      Product.findById.mockResolvedValue(mockProduct);

      const response = await request(app).get('/api/product/5f0b5cbbf14e2d9f9d81e5b3');

      expect(response.status).toBe(200);
      expect(response.body.product).toEqual(mockProduct);
    });

    it('should return error if product ID is invalid', async () => {
      const response = await request(app).get('/api/product/invalidID');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid product ID format.');
    });

    it('should return error if product is not found', async () => {
      Product.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/product/5f0b5cbbf14e2d9f9d81e5b3');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found.');
    });
  });

  describe('GET /all-products', () => {
    it('should fetch all products', async () => {
      const mockProducts = [{ productTitle: 'Laptop' }, { productTitle: 'Tablet' }];
      Product.find.mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/all-products');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
    });

    it('should return error if no products are found', async () => {
      Product.find.mockResolvedValue([]);

      const response = await request(app).get('/api/all-products');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No products found.');
    });
  });

  describe('PUT /update-product/:productId', () => {
    it('should update product details', async () => {
      const mockProduct = { save: jest.fn().mockResolvedValue(true) };
      Product.findById.mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/api/update-product/1')
        .field('productTitle', 'Updated Laptop');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully.');
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should return error if product is not found', async () => {
      Product.findById.mockResolvedValue(null);

      const response = await request(app).put('/api/update-product/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found.');
    });
  });
});
