const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Function to read JSON data
const fs = require('fs'); // Add this line
const path = require('path'); // Ensure this is included

const readDataFile = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf8'));
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
};
// Middleware to parse JSON data

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