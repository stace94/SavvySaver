

// External imports
const mongoose = require("mongoose");

// Load environment variables from a .env file
require('dotenv').config();

// Function to connect to the MongoDB database
async function dbConnect() {
  // Use mongoose to connect this app to our database on MongoDB using the DB_URL (connection string)
  mongoose.connect(
    process.env.DB_URL, // MongoDB connection string loaded from environment variables
    {
      // These are options to ensure that the connection is done properly
      useNewUrlParser: true,      // Use the new URL parser
      useUnifiedTopology: true,   // Use the new server discovery and monitoring engine
      useCreateIndex: true,       // Ensure that indexes are created
    }
  )
  .then(() => {
    // If the connection is successful, log a success message
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    // If there is an error during the connection, log an error message
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });
}

// Export the dbConnect function to make it accessible in other files
module.exports = dbConnect;
