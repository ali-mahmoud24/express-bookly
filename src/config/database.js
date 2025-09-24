const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB connected: ${connection.host}/${connection.name}`
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit app if DB connection fails
  }
};

module.exports = connectDB;
