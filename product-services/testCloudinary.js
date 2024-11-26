const cloudinary = require("./config/cloudinaryConfig");
const path = require("path");

(async () => {
  try {
    const result = await cloudinary.uploader.upload(path.join(__dirname, "test-image.jpg"), {
      folder: "test_upload",
    });

    console.log("Upload successful!");
    console.log("Uploaded file URL:", result.secure_url);
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
  }
})();
