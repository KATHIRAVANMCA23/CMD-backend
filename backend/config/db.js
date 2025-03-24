const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/CMS', {
    });
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports = connectDB;
