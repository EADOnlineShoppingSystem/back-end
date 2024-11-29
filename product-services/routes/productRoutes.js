const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const cloudinary = require("../config/cloudinaryConfig");
const Product = require("../models/Product");
const Category = require("../models/Category");

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


// Delete category and all associated products
router.delete("/delete-category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Delete all products associated with this category
    await Product.deleteMany({ categoryName: category.name });

    // Optionally, delete the category image from Cloudinary if it exists
    if (category.image?.public_id) {
      console.log("Deleting image from Cloudinary...");
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    // Use `findByIdAndDelete` to delete the category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Category and all associated products deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
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


//get product by Id
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

// Route to delete product
router.delete("/delete-product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete images from Cloudinary if the product has any
    if (product.images && product.images.length > 0) {
      // Loop through all images if the product has multiple images
      for (let image of product.images) {
        if (image.public_id) {
          console.log(`Deleting image with public_id: ${image.public_id}`);
          // Destroy image from Cloudinary
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
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


// Update Product Details (only update provided fields)
router.put("/update-product/:productId", upload.array("images", 10), async (req, res) => {
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

  // Create an object to hold the fields to update
  const updateFields = {};

  // Check if each field is provided and only update those fields
  if (categoryName) updateFields.categoryName = categoryName;
  if (productTitle) updateFields.productTitle = productTitle;
  if (productDescription) updateFields.productDescription = productDescription;
  if (lowestPrice) updateFields.lowestPrice = lowestPrice;
  if (largestPrice) updateFields.largestPrice = largestPrice;
  if (quantity) updateFields.quantity = quantity;
  if (tag) updateFields.tag = tag;
  if (warranty) updateFields.warranty = warranty;
  if (storages) {
    if (Array.isArray(storages)) {
      updateFields.storages = storages;
    } else {
      return res.status(400).json({ message: "Storages must be an array." });
    }
  }
  if (colors) {
    if (Array.isArray(colors)) {
      updateFields.colors = colors;
    } else {
      return res.status(400).json({ message: "Colors must be an array." });
    }
  }

  // If new images are uploaded, add those as well
  if (req.files && req.files.length > 0) {
    const imageUrls = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));
    updateFields.images = imageUrls;
  }

  try {
    // Validate productId format
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    // Find the product by ID and update only the specified fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateFields }, // Use $set to update only the specified fields
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error." });
  }
});


  

module.exports = router;

