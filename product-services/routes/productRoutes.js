const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Add category
// Add category with image upload
router.post("/add-category", upload.single("image"), async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    // Check if an image is uploaded
    let image = null;
    if (req.file) {
      image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // Create a new category with the image
    const category = new Category({ name, image });
    await category.save();

    res.status(201).json({ message: "Category added successfully.", category });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Edit category with image upload
router.put("/update-category/:categoryId", upload.single("image"), async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Update the name if provided
    if (name) {
      category.name = name;
    }

    // Update the image if a new one is uploaded
    if (req.file) {
      // Optionally delete the old image from Cloudinary
      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }

      // Add the new image
      category.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await category.save();
    res.status(200).json({ message: "Category updated successfully.", category });
  } catch (error) {
    console.error("Error updating category:", error);
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



router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  console.log("Received productId:", productId); // Debug log

  // Validate ObjectId format
  if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid product ID format." });
  }

  try {
    // Attempt to find the product by ID
    const product = await Product.findById(productId);

    // If product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Success response
    res.status(200).json({ product });
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching product details:", error);

    // General error response
    res.status(500).json({ message: "Server error.", error: error.message });
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

