// express-server.js
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

// ===== Connect to MongoDB =====
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let workspaceCollection;

async function connectMongoDB() {
  try {
    await client.connect();
    const db = client.db("shared_workspace_db");
    workspaceCollection = db.collection("workspaces");
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
connectMongoDB();

// ===== Routes =====

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Shared Workspace Web App API with MongoDB!");
});

// GET all workspaces
app.get("/workspaces", async (req, res) => {
  try {
    const workspaces = await workspaceCollection.find().toArray();
    res.json(workspaces);
  } catch (err) {
    res.status(500).send("Error fetching workspaces.");
  }
});

// POST a new workspace
app.post("/workspaces", async (req, res) => {
  const newWorkspace = req.body;
  try {
    const result = await workspaceCollection.insertOne(newWorkspace);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send("Error adding workspace.");
  }
});

// DELETE a workspace by ID
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

  console.log("👉 Received update request for ID:", id);
  console.log("📝 New data:", updatedWorkspace);

  try {
    const result = await workspaceCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedWorkspace }
    );

    console.log("🔧 MongoDB Update Result:", result);

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        error: "Workspace not found or no change made",
        attemptedId: id,
        matchedCount: result.matchedCount,
      });
    }

    res.json({ message: "✅ Workspace updated successfully" });
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(500).json({ error: "Failed to update workspace", details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
