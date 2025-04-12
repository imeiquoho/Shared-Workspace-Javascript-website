// ==============================
// express-server.js (Auth + Properties + Workspaces + Reviews)
// ==============================
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, userCollection, workspaceCollection, propertyCollection;

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

app.get("/", (req, res) => {
  res.send("Welcome to the Shared Workspace Web App API with MongoDB!");
});

// ----------- USER AUTHENTICATION -----------

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ----------- PROPERTY ROUTES -----------

app.get("/properties", async (req, res) => {
  try {
    const properties = await propertyCollection.find().toArray();
    res.json(properties);
  } catch (err) {
    res.status(500).send("Error fetching properties.");
  }
});

app.post("/properties", async (req, res) => {
  const newProperty = req.body;
  try {
    const result = await propertyCollection.insertOne(newProperty);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send("Error adding property.");
  }
});

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

app.get("/workspaces", async (req, res) => {
  try {
    const workspaces = await workspaceCollection.find().toArray();
    res.json(workspaces);
  } catch (err) {
    res.status(500).send("Error fetching workspaces.");
  }
});

app.post("/workspaces", async (req, res) => {
  const newWorkspace = req.body;
  try {
    const result = await workspaceCollection.insertOne(newWorkspace);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send("Error adding workspace.");
  }
});

app.delete("/workspaces/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await workspaceCollection.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).send("Error deleting workspace.");
  }
});

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

// ----------- REVIEWS -----------

//Get reviews for a workspace
app.get("/workspaces/:id/reviews", async (req, res) => {
  const id = req.params.id;
  try {
    const workspace = await workspaceCollection.findOne({ _id: new ObjectId(id) });
    res.json(workspace.reviews || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});
// POST review for a workspace
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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
