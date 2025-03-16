// workspaceData.js - Stores and manages user, property, and workspace data

// User data stored in an array (temporary storage for Phase 1)
const users = [];

// Property data stored in an array
const properties = [];

// Workspace data stored in an array
const workspaces = [];

// Function to add a new user
function addUser(name, phone, email, role) {
    const user = { id: users.length + 1, name, phone, email, role };
    users.push(user);
    console.log("User added:", user);
}

// Function to add a property
function addProperty(ownerId, address, neighborhood, size, parking, transport) {
    const property = { id: properties.length + 1, ownerId, address, neighborhood, size, parking, transport };
    properties.push(property);
    console.log("Property added:", property);
}

// Function to add a workspace
function addWorkspace(propertyId, type, capacity, smoking, availability, leaseTerm, price) {
    const workspace = { id: workspaces.length + 1, propertyId, type, capacity, smoking, availability, leaseTerm, price };
    workspaces.push(workspace);
    console.log("Workspace added:", workspace);
}

// Function to search for workspaces
function searchWorkspaces(term, minPrice, maxPrice, availability) {
    return workspaces.filter(workspace => {
        return (
            (workspace.type.toLowerCase().includes(term.toLowerCase()) || term === "") &&
            workspace.price >= (minPrice || 0) &&
            workspace.price <= (maxPrice || Infinity) &&
            (availability === "" || workspace.availability >= availability)
        );
    });
}

// Function to get workspaces by owner
function getOwnerWorkspaces(ownerId) {
    return properties.filter(prop => prop.ownerId === ownerId)
        .map(prop => workspaces.filter(ws => ws.propertyId === prop.id));
}

