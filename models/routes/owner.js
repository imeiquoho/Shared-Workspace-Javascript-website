/************************************************
 * routes/owner.js
 ************************************************/
const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");

// Create owner
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, propertyType } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Create owner in DB
    const newOwner = await Owner.create({ name, email, phone, propertyType });
    res.json({
      success: true,
      data: newOwner,
      message: "Owner registered successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error registering owner.",
      error: err.message,
    });
  }
});

module.exports = router;
