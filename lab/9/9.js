let products = [
  { id: 1, name: "Samsung Phone", category: "Smartphones", price: 25000, desc: "Smartphone with excellent features" },
  { id: 2, name: "iPhone", category: "Smartphones", price: 55000, desc: "Premium smartphone" },
  { id: 3, name: "HP Laptop", category: "Laptops", price: 45000, desc: "Laptop for study and work" },
  { id: 4, name: "iPad", category: "Tablets", price: 30000, desc: "Portable tablet" },
  { id: 5, name: "Headphones", category: "Accessories", price: 1500, desc: "Wireless headphones" }
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

function filterProducts(c) {
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
    alert("Enter your name and add products to the cart.");
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
  alert("Order placed successfully! Order ID: " + order.id);
  cart = [];
  showCart();
  showOrders();
}

function showOrders() {
  document.getElementById("orders").innerHTML = orders.map(o => `
    <div>
      <b>Order ID:</b> ${o.id}<br>
      <b>Customer:</b> ${o.customer}<br>
      <b>Products:</b> ${o.items.map(p => p.name + " × " + p.qty).join(", ")}<br>
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

  if (!name || price <= 0 || !desc) {
    alert("Enter a product name, valid price and description.");
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
    showCart();
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