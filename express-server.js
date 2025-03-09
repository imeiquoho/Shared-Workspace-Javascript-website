// ==============================
// express-server.js (Workspace API Server)
// ==============================
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());

// Function to read JSON data
function readDataFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'));
    } catch (err) {
        console.error(`Error reading ${filename}:`, err);
        return [];
    }
}

// Root endpoint
app.get('/', (req, res) => {
    res.send("Welcome to the Shared Workspace Web App API!");
});

// Get all workspaces
app.get('/workspaces', (req, res) => {
    const workspaces = readDataFile('data.json');
    res.json(workspaces);
});

// Get a specific workspace by ID
app.get('/workspaces/:id', (req, res) => {
    const workspaces = readDataFile('data.json');
    const workspace = workspaces.find(ws => ws.workspace_id === parseInt(req.params.id));
    if (workspace) {
        res.json(workspace);
    } else {
        res.status(404).send("Workspace not found.");
    }
});

app.listen(PORT, () => {
    console.log(`Express server running on http://127.0.0.1:${PORT}`);
});
