const mongoose = require("mongoose");
const Env = require("../config/envConfig");
const { ApiError } = require("../middleware/Error");

const connectToDb = async () => {
  try {
    console.log(Env.mongourl)
    mongoose.set("strictQuery", true); // optional, but recommended
    await mongoose.connect(Env.mongourl, {
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
