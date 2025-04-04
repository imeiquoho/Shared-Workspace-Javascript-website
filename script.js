/****************************************************
 * 1) SIGN UP: store minimal user info & role
 ****************************************************/
let userList = [];
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  
  let userName = document.getElementById("userName")?.value;
  let userPhone = document.getElementById("userPhone")?.value;
  let userEmail = document.getElementById("userEmail")?.value;
  let userRole = document.getElementById("userRole")?.value;

  let newUser = {
    name: userName,
    phone: userPhone,
    email: userEmail,
    role: userRole
  };

  userList.push(newUser);
  document.getElementById("signupSuccess").innerText = "Registration successful! Please log in.";
  this.reset();

  console.log("User List:", userList);
});

/****************************************************
 * 2) LIST PROPERTIES
 ****************************************************/
let propertiesList = [];
document.getElementById("propertyForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let address = document.getElementById("address")?.value;
  let neighborhood = document.getElementById("neighborhood")?.value;
  let squareFeet = document.getElementById("squareFeet")?.value;
  let parking = document.getElementById("parking")?.value;
  let publicTransport = document.getElementById("publicTransport")?.value;

  let newProperty = {
    address,
    neighborhood,
    squareFeet,
    parking,
    publicTransport
  };

  propertiesList.push(newProperty);
  document.getElementById("propertyMsg").innerText = "Property Added Successfully!";
  this.reset();

  console.log("Properties:", propertiesList);
});

/****************************************************
 * 3) LIST WORKSPACES
 ****************************************************/
let workspaceList = [];
document.getElementById("workspaceForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let propertySelect = document.getElementById("propertySelect")?.value;
  let workspaceType = document.getElementById("workspaceType")?.value;
  let seatingCapacity = document.getElementById("seatingCapacity")?.value;
  let smokingPolicy = document.getElementById("smokingPolicy")?.value;
  let availabilityDate = document.getElementById("availabilityDate")?.value;
  let leaseTerm = document.getElementById("leaseTerm")?.value;
  let price = document.getElementById("price")?.value;

  let newWorkspace = {
    property: propertySelect,
    type: workspaceType,
    seating: seatingCapacity,
    smoking: smokingPolicy,
    available: availabilityDate,
    term: leaseTerm,
    price
  };

  workspaceList.push(newWorkspace);
  document.getElementById("workspaceMsg").innerText = "Workspace Added Successfully!";
  this.reset();

  console.log("Workspaces:", workspaceList);
});

/****************************************************
 * 4) MODIFY: Just a placeholder example
 ****************************************************/
document.addEventListener("DOMContentLoaded", function() {
  // If 'modify.html' is open, we might populate propertyList or workspaceList
  if (document.getElementById("modifyContainer")) {
    renderModifiableItems();
  }
});

function renderModifiableItems() {
  // E.g., populate #propertyList and #workspaceList with items from arrays
  let propertyUl = document.getElementById("propertyList");
  let workspaceUl = document.getElementById("workspaceList");
  let modifyMsg = document.getElementById("modifyMsg");
  let modifyForm = document.getElementById("modifyForm");

  // Display properties
  propertiesList.forEach((prop, idx) => {
    let li = document.createElement("li");
    li.textContent = `${prop.address}, ${prop.neighborhood}, ${prop.squareFeet} sqft`;
    li.addEventListener("click", () => {
      modifyMsg.innerText = `Editing property #${idx}`;
      modifyForm.style.display = "block";
      // In real usage, you'd fill the form with current data, then save changes
    });
    propertyUl.appendChild(li);
  });

  // Display workspaces
  workspaceList.forEach((ws, idx) => {
    let li = document.createElement("li");
    li.textContent = `${ws.property}: ${ws.type}, $${ws.price}`;
    li.addEventListener("click", () => {
      modifyMsg.innerText = `Editing workspace #${idx}`;
      modifyForm.style.display = "block";
    });
    workspaceUl.appendChild(li);
  });

  // Example of saving changes (incomplete)
  modifyForm?.addEventListener("submit", function(e) {
    e.preventDefault();
    // e.g. read some field to update an item in propertiesList or workspaceList
    modifyMsg.innerText = "Changes saved (example)!";
    this.reset();
  });
}
// 🔐 Redirect if not logged in
function protectPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("⚠️ Please login to access this page.");
    window.location.href = "login.html";
  }
}

// 👋 Show greeting in navbar
function showUserGreeting() {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = document.querySelector(".nav-links");

  if (user && nav) {
    const greeting = document.createElement("li");
    greeting.textContent = `Hi, ${user.name}`;
    greeting.style.fontWeight = "bold";

    const logout = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = "Logout";
    btn.onclick = () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    };
    logout.appendChild(btn);

    nav.appendChild(greeting);
    nav.appendChild(logout);
  }
}
