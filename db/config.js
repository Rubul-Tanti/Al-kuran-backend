const mongoose = require("mongoose");
const env=require("dotenv")
const { ApiError } = require("../middleware/Error");
env.config()

const connectToDb = async () => {
  try {
    mongoose.set("strictQuery", true); // optional, but recommended
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (e) {
    console.error("❌ Error connecting to MongoDB:", e.message);
    throw new ApiError("Database connection failed", 500);
  }
};

module.exports = connectToDb;
