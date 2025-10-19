const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const { ApiError } = require("../middleware/Error");

const uploadToCloudinary = async (file) => {
  try {
    // Upload file
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: file.fieldname,
    });

    // Delete local file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    return uploadResult.secure_url;
  } catch (e) {
    // Try deleting even if upload fails
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlink(file.path, () => {});
    }
    throw new ApiError(e.message, 500);
  }
};

module.exports = uploadToCloudinary;
