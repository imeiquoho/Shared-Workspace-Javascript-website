const fs = require('fs');
const path = require('path');

// Logging
console.log("Shared Workspace Web App - Server Running");
console.log(`Project Directory: ${__dirname}`);

// Function to read JSON data from file
function readDataFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'));
    } catch (err) {
        console.error(`Error reading ${filename}:`, err);
        return [];
    }
}

// Function to write JSON data to file
function writeDataFile(filename, data) {
    try {
        fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(data, null, 2));
        console.log(`${filename} updated successfully.`);
    } catch (err) {
        console.error(`Error writing ${filename}:`, err);
    }
}

// Sample workspace data
const workspaces = readDataFile('data.json');
console.log("Current Workspaces:", workspaces);