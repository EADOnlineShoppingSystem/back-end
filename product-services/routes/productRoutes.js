const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");

// Add a new category
router.post("/add-category", async (req, res) => {
    const { name, attributes } = req.body;
  
    try {
      // Parse `attributes` if it's sent as a JSON string
      const parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
  
      // Validate the parsed attributes
      if (!Array.isArray(parsedAttributes) || parsedAttributes.some(attr => !attr.name || !attr.type)) {
        return res.status(400).json({ message: "Invalid attributes format." });
      }
  
      // Check if category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists." });
      }
  
      // Save the category
      const category = new Category({ name, attributes: parsedAttributes });
      await category.save();
  
      res.status(201).json({ message: "Category added successfully.", category });
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ message: "Server error." });
    }
  });
  

// Add a new product
router.post("/add-product", async (req, res) => {
  const { categoryId, name, attributes, priceRange, availableStock } = req.body;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Validate attributes against category definition
    const invalidAttributes = attributes && Object.keys(attributes).filter(attr => 
      !category.attributes.find(catAttr => catAttr.name === attr)
    );

    if (invalidAttributes?.length) {
      return res.status(400).json({ message: `Invalid attributes: ${invalidAttributes.join(", ")}` });
    }

    // Create a new product
    const product = new Product({
      category: categoryId,
      name,
      attributes,
      priceRange,
      availableStock,
    });
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
router.get("/products/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
  
    try {
      const products = await Product.find({ category: categoryId }).populate("category");
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

