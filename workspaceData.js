// workspaceData.js - Manages users, properties, workspaces, and reviews

// ===== Temporary In-Memory Data =====
const users = [];
const properties = [];
const workspaces = [];

// ===== User Functions =====
function addUser(name, phone, email, role) {
  const user = { id: users.length + 1, name, phone, email, role };
  users.push(user);
  console.log("User added:", user);
}

// ===== Property Functions =====
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
  console.log("Property added:", property);
}

// ===== Workspace Functions =====
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
  console.log("Workspace added:", workspace);
}

function searchWorkspaces(term, minPrice, maxPrice, availability) {
  return workspaces.filter((workspace) => {
    return (
      (workspace.type.toLowerCase().includes(term.toLowerCase()) || term === "") &&
      workspace.price >= (minPrice || 0) &&
      workspace.price <= (maxPrice || Infinity) &&
      (availability === "" || workspace.availability >= availability)
    );
  });
}

function getOwnerWorkspaces(ownerId) {
  return properties
    .filter((prop) => prop.ownerId === ownerId)
    .map((prop) => workspaces.filter((ws) => ws.propertyId === prop.id));
}

// ===== Reviews (MongoDB) =====

// Convert numeric rating to stars
function getStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// Load reviews for a workspace
async function loadReviews(workspaceId) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/workspaces/${workspaceId}/reviews`);
    const reviews = await response.json();

    const reviewList = document.getElementById("review-list");
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
    console.error("Error loading reviews:", err);
  }
}

// Submit review form logic
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedProperty = document.getElementById("propertySelect").value;
  const workspaceId = workspaceMap[selectedProperty]; // use your mapped ID

  const user = document.getElementById("reviewUser").value;
  const rating = parseInt(document.getElementById("reviewRating").value);
  const comment = document.getElementById("reviewComment").value;

  if (!workspaceId) return alert("Please select a valid property.");

  try {
    const res = await fetch(`http://127.0.0.1:3000/workspaces/${workspaceId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, rating, comment }),
    });

    const result = await res.json();
    document.getElementById("reviewMsg").textContent = result.message || "Review submitted!";
    loadReviews(workspaceId); // Refresh list
    e.target.reset();
  } catch (err) {
    console.error("Review submit failed:", err);
    document.getElementById("reviewMsg").textContent = "Failed to submit review.";
  }
});
