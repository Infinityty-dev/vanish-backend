const mongoose = require('mongoose');

// Database Connection Function
const connectDatabase = async () => {
  try {
    const dbUrl = process.env.MONGO_URI;
    if (!dbUrl) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    await mongoose.connect(dbUrl);

    console.log("✅ Database connection established successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDatabase;
