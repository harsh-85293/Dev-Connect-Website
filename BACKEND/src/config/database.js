const mongoose  = require("mongoose");

const connectdb = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 
      process.env.DB_CONNECTION_SECRET ||
      "mongodb+srv://namastedev:whAP4tG4NJWEDGCV@namastenode.oor8bmj.mongodb.net/devconnect";
    
    if (!mongoURI) {
      throw new Error("MongoDB URI not found in environment variables");
    }
    
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err; // Re-throw to handle in app.js
  }
};

module.exports = connectdb;
