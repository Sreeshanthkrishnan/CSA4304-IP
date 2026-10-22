let products = [
  { id: 1, name: "Men's T-Shirt", category: "Men", price: 599, desc: "Casual cotton T-shirt" },
  { id: 2, name: "Men's Shirt", category: "Men", price: 999, desc: "Formal slim-fit shirt" },
  { id: 3, name: "Women's Dress", category: "Women", price: 1499, desc: "Stylish party dress" },
  { id: 4, name: "Women's Top", category: "Women", price: 699, desc: "Casual fashion top" },
  { id: 5, name: "Kids Wear", category: "Children", price: 499, desc: "Comfortable kids clothing" },
  { id: 6, name: "Sneakers", category: "Footwear", price: 1299, desc: "Everyday casual shoes" },
  { id: 7, name: "Handbag", category: "Accessories", price: 899, desc: "Trendy fashion handbag" }
];

let cart = [];
let orders = [];
let category = "All";

function showProducts() {
  let search = document.getElementById("search").value.toLowerCase();

  document.getElementById("products").innerHTML = products
    .filter(p => (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search))
    .map(p => `
      <div class="card">
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <p>${p.desc}</p>
        <h3>₹${p.price}</h3>
        <p>Availability: In Stock</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `).join("");

  showAdmin();
}

function filter(c) {
  category = c;
  showProducts();
}

function addToCart(id) {
  let item = cart.find(p => p.id === id);
  if (item) item.qty++;
  else cart.push({ ...products.find(p => p.id === id), qty: 1 });
  showCart();
}

function showCart() {
  document.getElementById("cart").innerHTML = cart.map(p => `
    <div>
      ${p.name} - ₹${p.price} × ${p.qty}
      <button onclick="changeQty(${p.id}, -1)">−</button>
      <button onclick="changeQty(${p.id}, 1)">+</button>
      <button onclick="removeItem(${p.id})">Remove</button>
    </div>
  `).join("");

  document.getElementById("count").textContent =
    cart.reduce((sum, p) => sum + p.qty, 0);

  document.getElementById("total").textContent =
    "Total: ₹" + cart.reduce((sum, p) => sum + p.price * p.qty, 0);
}

function changeQty(id, amount) {
  let item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) removeItem(id);
  else showCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  showCart();
}

function checkout() {
  let name = document.getElementById("customer").value.trim();

  if (!name || cart.length === 0) {
    alert("Enter your name and add products to your cart.");
    return;
  }

  let order = {
    id: Date.now(),
    customer: name,
    items: cart.map(p => ({ ...p })),
    total: cart.reduce((sum, p) => sum + p.price * p.qty, 0),
    status: "Order Placed"
  };

  orders.push(order);
  alert("Order placed successfully!");
  cart = [];
  showCart();
  showOrders();
}

function showOrders() {
  document.getElementById("orders").innerHTML = orders.map(o => `
    <div>
      <b>Order ID:</b> ${o.id}<br>
      <b>Customer:</b> ${o.customer}<br>
      <b>Items:</b> ${o.items.map(p => p.name + " × " + p.qty).join(", ")}<br>
      <b>Total:</b> ₹${o.total}<br>
      <b>Status:</b> ${o.status}
    </div><hr>
  `).join("");
}

function addProduct() {
  let name = document.getElementById("pname").value.trim();
  let cat = document.getElementById("pcategory").value;
  let price = Number(document.getElementById("pprice").value);
  let desc = document.getElementById("pdesc").value.trim();

  if (!name || !desc || price <= 0) {
    alert("Enter product name, description and valid price.");
    return;
  }

  products.push({
    id: Date.now(),
    name: name,
    category: cat,
    price: price,
    desc: desc
  });

  document.getElementById("pname").value = "";
  document.getElementById("pprice").value = "";
  document.getElementById("pdesc").value = "";

  showProducts();
}

function showAdmin() {
  document.getElementById("admin").innerHTML = products.map(p => `
    <div>
      ${p.name} - ₹${p.price}
      <button onclick="editPrice(${p.id})">Edit Price</button>
      <button onclick="editDescription(${p.id})">Edit Description</button>
      <button onclick="deleteProduct(${p.id})">Delete</button>
    </div>
  `).join("");
}

function editPrice(id) {
  let p = products.find(p => p.id === id);
  let price = prompt("Enter new price:", p.price);

  if (price !== null && price.trim() !== "" &&
      Number.isFinite(Number(price)) && Number(price) > 0) {
    p.price = Number(price);
    showProducts();
  }
}

function editDescription(id) {
  let p = products.find(p => p.id === id);
  let desc = prompt("Enter new description:", p.desc);

  if (desc !== null && desc.trim() !== "") {
    p.desc = desc.trim();
    showProducts();
  }
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  cart = cart.filter(p => p.id !== id);
  showProducts();
  showCart();
}

showProducts();
showCart();
showOrders();