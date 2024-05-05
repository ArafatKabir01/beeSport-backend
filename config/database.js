const mongoose = require("mongoose");

const connectToDatabase = async (databaseURL) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await mongoose.connect(databaseURL);
      console.log("Connected to MongoDB Database");
      break; // Exit the loop if connected
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} to connect to MongoDB failed:`, error);
      if (attempts >= maxAttempts) {
        console.error(`Failed to connect to MongoDB after ${maxAttempts} attempts`);
      }
    }
  }
};

module.exports = connectToDatabase;
