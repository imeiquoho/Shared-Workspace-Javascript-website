/************************************************
 * server.js
 * Entry point for the Node/Express application.
 ************************************************/
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ownerRoutes = require("./routes/owner");
const workspaceRoutes = require("./routes/workspace");
const { MONGO_URI, PORT } = require("./config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (local or online)
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/workspace", workspaceRoutes);

// Basic error handling (unexpected routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
