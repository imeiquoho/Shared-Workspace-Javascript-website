/************************************************
 * models/Owner.js
 ************************************************/
// Import mongoose library for MongoDB interaction
const mongoose = require("mongoose");
// Define schema for Property Owner
const OwnerSchema = new mongoose.Schema({
 // Name of the property owner
  name: String,
// Email of the owner - must be unique
  email: { type: String, unique: true },
// Phone number of the owner
  phone: String,
// Type of property the owner manages (e.g., apartment, office)
  propertyType: String,
});
// Export the Owner model to be used in other parts of the application
module.exports = mongoose.model("Owner", OwnerSchema);
