const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Add a new category
router.post("/add-category", async (req, res) => {
    const { name} = req.body;
  
    try {
      // Check if category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists." });
      }
  
      // Save the category
      const category = new Category({ name});
      await category.save();
  
      res.status(201).json({ message: "Category added successfully.", category });
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ message: "Server error." });
    }
  });
  


// Add a new product
router.post("/add-product", async (req, res) => {
  const { 
    categoryName, 
    productTitle, 
    productDescription, 
    lowestPrice, 
    largestPrice, 
    quantity, 
    tag, 
    warranty, 
    storages, 
    colors 
  } = req.body;

  try {
    // Optionally: Validate that the category exists in the database
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Validate storages and colors (if provided)
    if (storages && !Array.isArray(storages)) {
      return res.status(400).json({ message: "Storages must be an array." });
    }
    if (colors && !Array.isArray(colors)) {
      return res.status(400).json({ message: "Colors must be an array." });
    }

    // Create a new product
    const product = new Product({
      categoryName,
      productTitle,
      productDescription,
      lowestPrice,
      largestPrice,
      quantity,
      tag,
      warranty,
      storages,
      colors,
    });

    // Save the product
    await product.save();

    res.status(201).json({ message: "Product added successfully.", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error." });
  }
});



//Get all  Category
router.get("/categories", async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Server error." });
    }
  });
  


// Fetch Products by Category
router.get("/getProducts/:categoryName", async (req, res) => {
  const { categoryName } = req.params;

  try {
    // Find products by categoryName
    const products = await Product.find({ categoryName });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this category." });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error." });
  }
});



  // Fetch Product Details by Product ID
  router.get("/product/:productId", async (req, res) => {
    const { productId } = req.params;
  
    console.log("Received productId:", productId); // Debug log
  
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }
  
    try {
      const product = await Product.findById(productId).populate("category");
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      res.status(200).json({ product });
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ message: "Server error." });
    }
  });
  

module.exports = router;

