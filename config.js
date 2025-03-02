/************************************************
 * config.js
 * Exports configuration variables.
 ************************************************/
module.exports = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/coworking",
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "mysecretkey", // for authentication
  };
  