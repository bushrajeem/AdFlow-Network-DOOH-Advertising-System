/**
 * db.js — MongoDB connection setup.
 * Call connectDB() once in server.js to establish the connection.
 * All models automatically use this connection via Mongoose.
 */

import mongoose from "mongoose";

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // Exit process if DB fails — backend is useless without database
    process.exit(1);
  }
}

export default connectDB;