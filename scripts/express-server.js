// ============================== 
// express-server.js (Auth + Properties + Workspaces + Reviews) 
// ============================== 

// Importing necessary libraries and initializing Express server
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Middleware to parse JSON requests

// Define port and MongoDB URI
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Client Setup
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database and collections
let db, userCollection, workspaceCollection, propertyCollection;

// Function to establish MongoDB connection
async function connectMongoDB() {
  try {
    await client.connect();
    db = client.db("shared_workspace_db");
    userCollection = db.collection("users");
    workspaceCollection = db.collection("workspaces");
    propertyCollection = db.collection("properties");
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
connectMongoDB();

// ===================== ROUTES =====================

// Basic API check
app.get("/", (req, res) => {
  res.send("Welcome to the Shared Workspace Web App API with MongoDB!");
});

// ----------- USER AUTHENTICATION -----------

// User Registration
app.post("/register", async (req, res) => {
  const { name, phone, email, role, password } = req.body;

  try {
    const existing = await userCollection.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists." });

    await userCollection.insertOne({ name, phone, email, role, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Authenticate user credentials
    const user = await userCollection.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ----------- PROPERTY ROUTES -----------

// Get all properties
app.get("/properties", async (req, res) => {
  try {
    const properties = await propertyCollection.find().toArray();
    res.json(properties);
  } catch (err) {
    res.status(500).send("Error fetching properties.");
  }
});

// Add a new property
app.post("/properties", async (req, res) => {
  const newProperty = req.body;
  try {
    const result = await propertyCollection.insertOne(newProperty);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send("Error adding property.");
  }
});

// Delete a property by ID
app.delete("/properties/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await propertyCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send("Error deleting property.");
  }
});

// ----------- WORKSPACE ROUTES -----------

// Get all workspaces
app.get("/workspaces", async (req, res) => {
  try {
    const workspaces = await workspaceCollection.find().toArray();
    res.json(workspaces);
  } catch (err) {
    res.status(500).send("Error fetching workspaces.");
  }
});

// Add a new workspace (safely handling optional amenities)
app.post("/workspaces", async (req, res) => {
  const { property, type, location, amenities, seating, smoking, available, term, price } = req.body;

  // Validate and safely handle amenities field
  let amenitiesArray = [];
  if (amenities && typeof amenities === 'string') {
    amenitiesArray = amenities.split(",").map(a => a.trim());
  }

  // Prepare new workspace object
  const newWorkspace = {
    property,
    type,
    location,
    amenities: amenitiesArray, // Safely handled amenities
    seating,
    smoking,
    available,
    term,
    price,
    reviews: [], // Initialize reviews as empty array
  };

  // Insert the workspace into MongoDB
  try {
    const result = await workspaceCollection.insertOne(newWorkspace);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send("Error adding workspace.");
  }
});

// Delete a workspace by ID
app.delete("/workspaces/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await workspaceCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send("Error deleting workspace.");
  }
});

// Update workspace by ID
app.put("/workspaces/:id", async (req, res) => {
  const id = req.params.id;
  const updatedWorkspace = req.body;

  try {
    const result = await workspaceCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedWorkspace }
    );

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return res.status(404).json({ error: "Workspace not found or no change made" });
    }

    res.json({ message: "Workspace updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update workspace", details: err.message });
  }
});

// ----------- REVIEWS ROUTES -----------

// Get reviews for a workspace
app.get("/workspaces/:id/reviews", async (req, res) => {
  const id = req.params.id;
  try {
    const workspace = await workspaceCollection.findOne({ _id: new ObjectId(id) });
    res.json(workspace.reviews || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// Post a review for a workspace
app.post("/workspaces/:id/reviews", async (req, res) => {
  const id = req.params.id;
  const { user, rating, comment } = req.body;
  try {
    const result = await workspaceCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: { user, rating, comment, date: new Date() } } }
    );
    res.status(201).json({ message: "Review added", result });
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
});

// ===================== START SERVER =====================
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
