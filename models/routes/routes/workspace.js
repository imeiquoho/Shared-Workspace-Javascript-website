/************************************************
 * routes/workspace.js
 * For listing workspaces, etc.
 ************************************************/
const express = require("express");
const router = express.Router();

// Example in-memory array for workspace
let workspaceList = [];

// Add workspace
router.post("/add", (req, res) => {
  try {
    const {
      property,
      workspaceType,
      seatingCapacity,
      smokingPolicy,
      availabilityDate,
      leaseTerm,
      rentalPrice
    } = req.body;

    // Validate required fields
    if (!property || !workspaceType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields."
      });
    }

    const newWorkspace = {
      property,
      workspaceType,
      seatingCapacity,
      smokingPolicy,
      availabilityDate,
      leaseTerm,
      rentalPrice,
      createdAt: new Date()
    };

    workspaceList.push(newWorkspace);

    res.json({
      success: true,
      message: "Workspace added successfully.",
      data: newWorkspace
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error adding workspace.",
      error: err.message
    });
  }
});

// (Optional) GET all
router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: workspaceList,
  });
});

module.exports = router;
