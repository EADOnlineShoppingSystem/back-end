const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Add category
router.post("/add-category", async (req, res) => {
  const { name } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: "Category added successfully.", category });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Add a new product
router.post("/add-product",upload.array("images", 10),  async (req, res) => {
console.log(req.body);
console.log(req.files);

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
    colors,
  } = req.body;

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const imageUrls = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

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
      images: imageUrls,
    });

    await product.save();

    res.status(201).json({ message: "Product added successfully.", product });
  } catch (error) {
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

  //get all products
router.get("/all-products", async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({ message: "No products found." });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error." });
  }
});



  // Update Product Details
router.put("/update-product/:productId", async (req, res) => {
  const { productId } = req.params;
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
    colors,
  } = req.body;

  try {
    // Validate productId format
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Optional: Validate categoryName if it is updated
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      product.categoryName = categoryName;
    }

    // Update product details
    if (productTitle) product.productTitle = productTitle;
    if (productDescription) product.productDescription = productDescription;
    if (lowestPrice) product.lowestPrice = lowestPrice;
    if (largestPrice) product.largestPrice = largestPrice;
    if (quantity) product.quantity = quantity;
    if (tag) product.tag = tag;
    if (warranty) product.warranty = warranty;
    if (storages) {
      if (!Array.isArray(storages)) {
        return res.status(400).json({ message: "Storages must be an array." });
      }
      product.storages = storages;
    }
    if (colors) {
      if (!Array.isArray(colors)) {
        return res.status(400).json({ message: "Colors must be an array." });
      }
      product.colors = colors;
    }

    // Save updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully.", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error." });
  }
});

  

module.exports = router;

