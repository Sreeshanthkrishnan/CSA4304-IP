let properties = [
  { id: 1, name: "Family House", location: "Chennai", price: 4500000, type: "House", details: "3 bedrooms, parking, garden" },
  { id: 2, name: "Modern Apartment", location: "Bangalore", price: 3500000, type: "Apartment", details: "2 bedrooms, lift, security" },
  { id: 3, name: "Residential Land", location: "Tirupati", price: 1500000, type: "Land", details: "1200 sq.ft. residential plot" },
  { id: 4, name: "Luxury House", location: "Chennai", price: 7500000, type: "House", details: "4 bedrooms, car parking" }
];

let favorites = [];
let visits = Number(localStorage.getItem("homeVisits") || 0) + 1;
localStorage.setItem("homeVisits", visits);
document.getElementById("visitors").textContent = visits;

function displayProperties(list) {
  document.getElementById("properties").innerHTML = list.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p>Location: ${p.location}</p>
      <p>Type: ${p.type}</p>
      <p>Price: ₹${p.price.toLocaleString("en-IN")}</p>
      <p>${p.details}</p>
      <button onclick="addFavorite(${p.id})">❤️ Favorite</button>
      <button onclick="viewProperty(${p.id})">View Details</button>
      <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.location)}">View Map</a>
    </div>
  `).join("");
}

function searchProperties() {
  let location = document.getElementById("location").value.toLowerCase();
  let budget = Number(document.getElementById("budget").value) || Infinity;
  let type = document.getElementById("type").value;

  localStorage.setItem("savedSearch", JSON.stringify({
    location, budget: budget === Infinity ? "" : budget, type
  }));

  let results = properties.filter(p =>
    p.location.toLowerCase().includes(location) &&
    p.price <= budget &&
    (type === "All" || p.type === type)
  );

  displayProperties(results);
}

function savedSearch() {
  let saved = JSON.parse(localStorage.getItem("savedSearch") || "null");

  if (!saved) {
    alert("No saved search found.");
    return;
  }

  document.getElementById("location").value = saved.location;
  document.getElementById("budget").value = saved.budget;
  document.getElementById("type").value = saved.type;
  searchProperties();
}

function addFavorite(id) {
  let property = properties.find(p => p.id === id);

  if (!favorites.some(p => p.id === id)) {
    favorites.push(property);
  }

  document.getElementById("favorites").innerHTML = favorites.map(p =>
    `<p>${p.name} - ${p.location} - ₹${p.price.toLocaleString("en-IN")}</p>`
  ).join("");
}

function viewProperty(id) {
  let p = properties.find(p => p.id === id);
  alert(
    "Property: " + p.name +
    "\nLocation: " + p.location +
    "\nType: " + p.type +
    "\nPrice: ₹" + p.price.toLocaleString("en-IN") +
    "\nDetails: " + p.details
  );
}

function login() {
  let username = prompt("Enter buyer username:");
  if (!username) return;

  let password = prompt("Enter password:");
  if (!password) return;

  alert("Demo login successful, " + username + "!");
}

displayProperties(properties);