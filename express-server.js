const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Function to read JSON data
const readDataFile = () => {
    try {
        const dataPath = path.join(__dirname, 'data.json'); // Ensure correct path
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        console.error("Error reading data.json:", err);
        return [];
    }
};

// Root Endpoint
app.get('/', (req, res) => {
    res.send("Welcome to the Shared Workspace Web App API!");
});

// Get all workspaces
app.get('/workspaces', (req, res) => {
    const workspaces = readDataFile();
    res.json(workspaces);
});

// Get a specific workspace by ID
app.get('/workspaces/:id', (req, res) => {
    const workspaces = readDataFile();
    const workspace = workspaces.find(ws => ws.workspace_id === parseInt(req.params.id));
    if (workspace) {
        res.json(workspace);
    } else {
        res.status(404).send("Workspace not found.");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Express server running on http://127.0.0.1:${PORT}`);
});
