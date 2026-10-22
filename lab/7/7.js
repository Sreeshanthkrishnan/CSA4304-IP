const SERVICES = [
  {
    name: "Signature Haircut",
    price: 650,
    duration: 45,
    icon: "✂",
    desc: "A fresh cut, shaped around you."
  },
  {
    name: "Hair Spa",
    price: 1200,
    duration: 60,
    icon: "♨",
    desc: "A nourishing reset for your hair."
  },
  {
    name: "Glow Facial",
    price: 1500,
    duration: 60,
    icon: "✦",
    desc: "A relaxing boost for radiant skin."
  },
  {
    name: "Manicure & Pedicure",
    price: 950,
    duration: 60,
    icon: "♡",
    desc: "Careful details from hand to toe."
  },
  {
    name: "Party Makeup",
    price: 2500,
    duration: 90,
    icon: "✧",
    desc: "A look made for your occasion."
  },
  {
    name: "Threading & Brows",
    price: 250,
    duration: 20,
    icon: "〰",
    desc: "A neat, natural finish."
  },
  {
    name: "Bridal Consultation",
    price: 500,
    duration: 30,
    icon: "❀",
    desc: "Plan your special-day look."
  },
  {
    name: "Head Massage",
    price: 700,
    duration: 30,
    icon: "☼",
    desc: "Relax and let the day go."
  }
];

const STYLISTS = [
  {
    name: "Ananya Rao",
    role: "Senior Stylist",
    initials: "AR",
    rating: "★ 4.9"
  },
  {
    name: "Meera Shah",
    role: "Skin Care Expert",
    initials: "MS",
    rating: "★ 4.8"
  },
  {
    name: "Diya Nair",
    role: "Makeup Artist",
    initials: "DN",
    rating: "★ 5.0"
  }
];

const TIMES = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00"
];

const STORAGE_KEY = "glowGraceBookings";
const FEEDBACK_KEY = "glowGraceFeedback";

const $ = id => document.getElementById(id);

const money = amount =>
  "₹" + Number(amount).toLocaleString("en-IN");

function readBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function todayLocal() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);

  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
}

/* Display services */

function renderServices() {
  $("service-grid").innerHTML = SERVICES.map((service, index) => `
    <article class="service-card">
      <div class="service-icon">${service.icon}</div>

      <h3>${service.name}</h3>

      <p>${service.desc}</p>

      <div class="service-bottom">
        <span>${money(service.price)}</span>
        <small>${service.duration} min</small>
      </div>

      <button
        class="small-button choose-service"
        data-index="${index}"
        style="margin-top:12px">
        Choose Service ↗
      </button>
    </article>
  `).join("");

  $("service-select").innerHTML = SERVICES.map((service, index) => `
    <option value="${index}">
      ${service.name} — ${money(service.price)}
    </option>
  `).join("");
}

/* Display stylists */

function renderStylists() {
  $("stylist-grid").innerHTML = STYLISTS.map(stylist => `
    <article class="stylist-card">
      <div class="stylist-avatar">${stylist.initials}</div>

      <div>
        <h3>${stylist.name}</h3>
        <p>${stylist.role}</p>
        <span>${stylist.rating} · Customer favourite</span>
      </div>
    </article>
  `).join("");

  $("stylist-select").innerHTML = STYLISTS.map((stylist, index) => `
    <option value="${index}">${stylist.name}</option>
  `).join("");
}

/* Calculate service price */

function selectedService() {
  return SERVICES[Number($("service-select").value)] || SERVICES[0];
}

function updatePrice() {
  const price = selectedService().price;

  $("deposit-price").textContent = money(Math.ceil(price * 0.2));
  $("full-price").textContent = money(price);
}

/* Check already-booked time slots */

function bookedTimes(date, stylistIndex, ignoreId = null) {
  return readBookings()
    .filter(booking =>
      booking.date === date &&
      Number(booking.stylistIndex) === Number(stylistIndex) &&
      booking.status !== "Cancelled" &&
      booking.id !== ignoreId
    )
    .map(booking => booking.time);
}

/* Show available times */

function refreshTimes() {
  const date = $("booking-date").value;
  const stylist = $("stylist-select").value;
  const previousTime = $("time-select").value;

  let available = TIMES.filter(time =>
    !bookedTimes(date, stylist).includes(time)
  );

  if (date === todayLocal()) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    available = available.filter(time => {
      const [hours, minutes] = time.split(":").map(Number);

      return hours * 60 + minutes > currentMinutes;
    });
  }

  $("time-select").innerHTML = available.length
    ? available.map(time => `
        <option value="${time}">${formatTime(time)}</option>
      `).join("")
    : `<option value="">No slots available</option>`;

  if (available.includes(previousTime)) {
    $("time-select").value = previousTime;
  }
}

/* Customer dashboard */

function renderCustomerBookings() {
  const email = $("account-email").value.trim().toLowerCase();

  if (!email) {
    $("customer-bookings").innerHTML = `
      <div class="empty-state">
        Enter your booking email to see appointments.
      </div>
    `;
    return;
  }

  const bookings = readBookings()
    .filter(booking => booking.email.toLowerCase() === email)
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );

  if (!bookings.length) {
    $("customer-bookings").innerHTML = `
      <div class="empty-state">
        No appointments found for this email.
      </div>
    `;
    return;
  }

  $("customer-bookings").innerHTML =
    bookings.map(booking => bookingCard(booking, false)).join("");
}

/* Create a booking card */

function bookingCard(booking, staff) {
  const service =
    SERVICES[booking.serviceIndex]?.name || "Beauty Service";

  const stylist =
    STYLISTS[booking.stylistIndex]?.name || "Stylist";

  const status = booking.status || "Confirmed";

  let customerActions = "";

  if (!staff && status !== "Cancelled") {
    customerActions = `
      <button class="small-button"
        data-action="reschedule"
        data-id="${booking.id}">
        Reschedule
      </button>

      <button class="small-button"
        data-action="cancel"
        data-id="${booking.id}">
        Cancel
      </button>
    `;
  }

  let staffActions = "";

  if (staff && status !== "Cancelled") {
    staffActions = `
      <button class="small-button"
        data-action="contact"
        data-id="${booking.id}">
        Email Customer
      </button>

      <button class="small-button"
        data-action="cancel"
        data-id="${booking.id}">
        Cancel
      </button>
    `;
  }

  const actions = staff ? staffActions : customerActions;

  return `
    <article class="booking-item">

      <div>
        <h3>
          ${escapeHTML(service)}
          <span class="status ${
            status === "Cancelled" ? "cancelled" : ""
          }">
            ${escapeHTML(status)}
          </span>
        </h3>

        <p>
          ${escapeHTML(booking.name)} ·
          ${escapeHTML(stylist)}
        </p>

        <p>
          📅 ${escapeHTML(booking.date)}
          at ${formatTime(booking.time)}
        </p>

        <p>
          ${staff
            ? "Customer: " + escapeHTML(booking.email)
            : "Payment preference: " + escapeHTML(booking.paymentType)
          }
        </p>

        <p>
          Service price:
          ${money(SERVICES[booking.serviceIndex]?.price || 0)}
        </p>
      </div>

      <div class="booking-actions">
        ${actions}
      </div>

    </article>
  `;
}

/* Staff reservation manager */

function renderStaffBookings() {
  const filter = $("staff-date-filter").value;

  const bookings = readBookings()
    .filter(booking => !filter || booking.date === filter)
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );

  $("staff-bookings").innerHTML = bookings.length
    ? bookings.map(booking => bookingCard(booking, true)).join("")
    : `<div class="empty-state">No reservations found.</div>`;
}

/* Update a booking */

function updateBooking(id, changes) {
  const bookings = readBookings();

  const index = bookings.findIndex(booking => booking.id === id);

  if (index < 0) return;

  bookings[index] = {
    ...bookings[index],
    ...changes
  };

  saveBookings(bookings);

  renderCustomerBookings();
  renderStaffBookings();
  refreshTimes();
}

/* Cancel, reschedule, or contact a customer */

function handleBookingAction(button) {
  const id = button.dataset.id;
  const action = button.dataset.action;

  const booking = readBookings().find(item => item.id === id);

  if (!booking) return;

  if (action === "cancel") {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      updateBooking(id, {
        status: "Cancelled"
      });

      alert("Appointment cancelled successfully.");
    }
  }

  else if (action === "reschedule") {
    const date = prompt(
      "Enter the new date (YYYY-MM-DD):",
      booking.date
    );

    if (!date) return;

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      date < todayLocal() ||
      new Date(date + "T00:00:00").toISOString().slice(0, 10) !== date
    ) {
      alert("Please enter a valid date that is today or later.");
      return;
    }

    const unavailable = bookedTimes(
      date,
      booking.stylistIndex,
      booking.id
    );

    let choices = TIMES.filter(time =>
      !unavailable.includes(time)
    );

    if (date === todayLocal()) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      choices = choices.filter(time => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes > currentMinutes;
      });
    }

    if (!choices.length) {
      alert("No available times for this stylist on that date.");
      return;
    }

    const time = prompt(
      "Available times:\n" +
      choices.map(formatTime).join(", ") +
      "\nEnter a time in 24-hour format, such as 14:00:",
      choices[0]
    );

    if (!choices.includes(time)) {
      alert("Please select one of the available times.");
      return;
    }

    updateBooking(id, {
      date,
      time,
      status: "Confirmed"
    });

    alert("Appointment rescheduled successfully.");
  }

  else if (action === "contact") {
    const subject = encodeURIComponent(
      "Your Glow & Grace appointment"
    );

    const body = encodeURIComponent(
      `Hello ${booking.name},

Your appointment for ${
        SERVICES[booking.serviceIndex]?.name
      } is scheduled for ${booking.date} at ${
        formatTime(booking.time)
      }.

Glow & Grace`
    );

    window.location.href =
      `mailto:${encodeURIComponent(booking.email)}` +
      `?subject=${subject}&body=${body}`;
  }
}

/* Start the website */

function init() {
  renderServices();
  renderStylists();

  $("booking-date").min = todayLocal();
  $("booking-date").value = todayLocal();

  updatePrice();
  refreshTimes();

  $("service-select").addEventListener("change", () => {
    updatePrice();
    refreshTimes();
  });

  $("booking-date").addEventListener("change", refreshTimes);
  $("stylist-select").addEventListener("change", refreshTimes);

  /* Select a service from the services section */

  $("service-grid").addEventListener("click", event => {
    const button = event.target.closest(".choose-service");

    if (!button) return;

    $("service-select").value = button.dataset.index;

    updatePrice();

    document.querySelector("#booking").scrollIntoView({
      behavior: "smooth"
    });
  });

  /* Create a new appointment */

  $("booking-form").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("customer-name").value.trim();

    const email = $("customer-email")
      .value.trim().toLowerCase();

    const date = $("booking-date").value;
    const time = $("time-select").value;

    if (!time) {
      $("form-message").textContent =
        "No available times. Please choose another date.";
      return;
    }

    if (date < todayLocal()) {
      $("form-message").textContent =
        "Please choose today or a future date.";
      return;
    }

    const stylistIndex = Number($("stylist-select").value);

    if (bookedTimes(date, stylistIndex).includes(time)) {
      refreshTimes();

      $("form-message").textContent =
        "This slot is already booked. Please select another time.";

      return;
    }

    const serviceIndex = Number($("service-select").value);
    const service = SERVICES[serviceIndex];

    const paymentType = document.querySelector(
      'input[name="payment"]:checked'
    ).value;

    const booking = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),

      name,
      email,
      serviceIndex,
      stylistIndex,
      date,
      time,
      paymentType,

      amountDue: paymentType === "deposit"
        ? Math.ceil(service.price * 0.2)
        : service.price,

      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    const bookings = readBookings();

    bookings.push(booking);

    saveBookings(bookings);

    $("form-message").textContent =
      `Appointment confirmed! ${service.name} is booked for ` +
      `${date} at ${formatTime(time)}. ` +
      "Demo only: no payment was processed.";

    $("account-email").value = email;

    renderCustomerBookings();
    renderStaffBookings();

    $("booking-form").reset();

    $("booking-date").value = todayLocal();

    updatePrice();
    refreshTimes();
  });

  /* View customer appointments */

  $("load-bookings").addEventListener(
    "click",
    renderCustomerBookings
  );

  $("account-email").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      renderCustomerBookings();
    }
  });

  $("customer-bookings").addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (button) {
      handleBookingAction(button);
    }
  });

  /* Staff panel actions */

  $("staff-bookings").addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (button) {
      handleBookingAction(button);
    }
  });

  $("staff-date-filter").addEventListener(
    "change",
    renderStaffBookings
  );

  $("clear-date-filter").addEventListener("click", () => {
    $("staff-date-filter").value = "";
    renderStaffBookings();
  });

  $("admin-toggle").addEventListener("click", () => {
    const panel = $("staff-panel");

    panel.classList.toggle("hidden");

    if (!panel.classList.contains("hidden")) {
      renderStaffBookings();

      panel.scrollIntoView({
        behavior: "smooth"
      });

      $("admin-toggle").textContent = "Hide Staff View";
    } else {
      $("admin-toggle").textContent = "Staff View";
    }
  });

  /* Save customer feedback */

  $("feedback-form").addEventListener("submit", event => {
    event.preventDefault();

    const feedback = {
      name: $("feedback-name").value.trim(),
      message: $("feedback-text").value.trim(),
      date: new Date().toISOString()
    };

    let allFeedback = [];

    try {
      allFeedback =
        JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || [];
    } catch {
      allFeedback = [];
    }

    allFeedback.push(feedback);

    localStorage.setItem(
      FEEDBACK_KEY,
      JSON.stringify(allFeedback)
    );

    $("feedback-message").textContent =
      "Thank you! Your feedback has been saved.";

    event.target.reset();
  });
}

document.addEventListener("DOMContentLoaded", init);