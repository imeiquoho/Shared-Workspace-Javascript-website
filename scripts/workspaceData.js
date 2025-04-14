// workspaceData.js - Manages users, properties, workspaces, and reviews (temporary client-side)

// Initialize data structures for holding users, properties, and workspaces
const users = [];
const properties = [];
const workspaces = [];

// ===== User Management =====
// Function to add a new user
function addUser(name, phone, email, role) {
  const user = { id: users.length + 1, name, phone, email, role };
  users.push(user);
  console.log("✅ User added:", user);
}

// ===== Property Management =====
// Function to add a new property
function addProperty(ownerId, address, neighborhood, size, parking, transport) {
  const property = {
    id: properties.length + 1,
    ownerId,
    address,
    neighborhood,
    size,
    parking,
    transport,
  };
  properties.push(property);
  console.log("🏠 Property added:", property);
}

// ===== Workspace Management =====
// Function to add a new workspace linked to a property
function addWorkspace(propertyId, type, capacity, smoking, availability, leaseTerm, price) {
  const workspace = {
    id: workspaces.length + 1,
    propertyId,
    type,
    capacity,
    smoking,
    availability,
    leaseTerm,
    price,
  };
  workspaces.push(workspace);
  console.log("💼 Workspace added:", workspace);
}

// ===== Workspace Search =====
// Function to search for workspaces based on various filters
function searchWorkspaces(term = "", minPrice = 0, maxPrice = Infinity, availability = "") {
  return workspaces.filter((workspace) => {
    return (
      workspace.type.toLowerCase().includes(term.toLowerCase()) &&
      workspace.price >= minPrice &&
      workspace.price <= maxPrice &&
      (availability === "" || workspace.availability >= availability)
    );
  });
}

// ===== Owner Listings =====
// Function to retrieve all workspaces listed by a specific property owner
function getOwnerWorkspaces(ownerId) {
  return properties
    .filter((prop) => prop.ownerId === ownerId)
    .map((prop) => workspaces.filter((ws) => ws.propertyId === prop.id));
}

// ===== Reviews (MongoDB) Integration =====

// ⭐ Convert numeric rating to star icons
function getStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// 📥 Load and display reviews for a workspace
async function loadReviews(workspaceId) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/workspaces/${workspaceId}/reviews`);
    const reviews = await response.json();

    const reviewList = document.getElementById("review-list");
    if (!reviewList) return;

    reviewList.innerHTML = "";

    reviews.forEach((review) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${review.user}</strong><br>
        <span class="stars">${getStars(review.rating)}</span><br>
        <em>${review.comment}</em>
      `;
      reviewList.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Error loading reviews:", err);
  }
}

// 📝 Submit review (from frontend form)
// Submits review data to MongoDB and refreshes the review display
document.getElementById("reviewForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedProperty = document.getElementById("propertySelect")?.value;
  const workspaceId = workspaceMap?.[selectedProperty]; // map property name to workspace _id

  const user = document.getElementById("reviewUser")?.value;
  const rating = parseInt(document.getElementById("reviewRating")?.value);
  const comment = document.getElementById("reviewComment")?.value;

  if (!workspaceId || !user || !rating || !comment) {
    alert("Please fill in all review fields and select a valid workspace.");
    return;
  }

  try {
    const res = await fetch(`http://127.0.0.1:3000/workspaces/${workspaceId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, rating, comment }),
    });

    const result = await res.json();
    document.getElementById("reviewMsg").textContent = result.message || "Review submitted!";
    loadReviews(workspaceId); // Reload reviews
    e.target.reset();
  } catch (err) {
    console.error("❌ Failed to submit review:", err);
    document.getElementById("reviewMsg").textContent = "Failed to submit review.";
  }
});
