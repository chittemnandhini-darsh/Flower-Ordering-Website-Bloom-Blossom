
const products = [
    { id: 1, name: "Rose Bouquet", price: 499 },
    { id: 2, name: "Pink Tulips", price: 699 },
    { id: 3, name: "White Lilies", price: 599 },
    { id: 4, name: "Sunflower Bunch", price: 399 }
];

let cart = [];

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const orderMessage = document.getElementById("order-message");

// Add flower to cart
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        const product = products.find(item => item.id === id);
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        renderCart();
    });
});

// Display cart
function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            "<p>Your cart is empty. Add some beautiful flowers!</p>";
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("strong");
        name.textContent = `${item.name} — ₹${item.price * item.quantity}`;

        const controls = document.createElement("div");
        controls.className = "cart-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Remove one ${item.name}`);

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Add one ${item.name}`);

        const remove = document.createElement("button");
        remove.textContent = "Remove";

        minus.addEventListener("click", () => changeQuantity(item.id, -1));
        plus.addEventListener("click", () => changeQuantity(item.id, 1));
        remove.addEventListener("click", () => removeItem(item.id));

        controls.append(minus, quantity, plus, remove);
        row.append(name, controls);
        cartItems.appendChild(row);
    });

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = count;
    cartTotal.textContent = `Total: ₹${total}`;
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
}

// Remove product
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Search flowers
document.getElementById("search").addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    let visibleCount = 0;

    document.querySelectorAll(".product-card").forEach(card => {
        const matches = card.dataset.name.toLowerCase().includes(searchText);
        card.hidden = !matches;

        if (matches) visibleCount++;
    });

    document.getElementById("no-results").hidden = visibleCount !== 0;
});

// Set minimum delivery date to today
const dateInput = document.getElementById("delivery-date");
const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;

// Proceed to order form
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Please add flowers to your cart first.");
        return;
    }

    document.getElementById("order").scrollIntoView({
        behavior: "smooth"
    });
});

// Place order
document.getElementById("order-form").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty. Please add flowers first.");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    orderMessage.textContent =
        `Thank you, ${name}! Your demo order total is ₹${total}. ` +
        "Please contact the shop to confirm your order.";

    cart = [];
    renderCart();
    event.target.reset();
    dateInput.min = localToday;
});