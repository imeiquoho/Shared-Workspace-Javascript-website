const express = require("express");
const app = express();
const PORT = 3000;

// Sample workspace data
const workspaces = [
    {
        workspace_id: 101,
        name: "Downtown Co-Working Space",
        location: "Calgary",
        capacity: 20,
        availability: "Available",
        amenities: ["WiFi", "Meeting Rooms", "Parking"]
    },
    {
        workspace_id: 102,
        name: "Tech Hub Office",
        location: "Toronto",
        capacity: 50,
        availability: "Fully Booked",
        amenities: ["WiFi", "Coffee", "24/7 Access"]
    },
    {
        workspace_id: 103,
        name: "Startup Innovation Center",
        location: "Vancouver",
        capacity: 35,
        availability: "Available",
        amenities: ["Projector", "Event Space", "Cafeteria"]
    }
];

// ✅ Default route to handle GET request at "/"
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Shared Workspace Web App</h1><p>Server is running successfully!</p>");
});

// Display project details in the console
console.log("Shared Workspace Web App - Server Running");
console.log("Project Directory:", __dirname);
console.log("Current Workspaces:", JSON.stringify(workspaces, null, 2));

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
});
