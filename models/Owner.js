/************************************************
 * models/Owner.js
 ************************************************/
const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  propertyType: String,
});

module.exports = mongoose.model("Owner", OwnerSchema);
