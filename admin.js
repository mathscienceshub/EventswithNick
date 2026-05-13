const ADMIN_PASSWORD = "nick2026";
const STORAGE_KEYS = {
  session: "ewnAdminSession",
  siteDetails: "ewnSiteDetails",
  bookings: "ewnBookings"
};

const DEFAULTS = window.EWN_DEFAULTS || {};
let selectedBookingId = null;

const loginScreen = document.getElementById("loginScreen");
const adminShell = document.getElementById("adminShell");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const sideLinks = document.querySelectorAll(".side-link");
const tabTriggers = document.querySelectorAll("[data-tab-trigger]");
const statusFilter = document.getElementById("statusFilter");
const bookingSearch = document.getElementById("bookingSearch");
const bookingsTable = document.getElementById("bookingsTable");
const recentBookings = document.getElementById("recentBookings");
const businessSnapshot = document.getElementById("businessSnapshot");
const bookingDetailsForm = document.getElementById("bookingDetailsForm");
const emptyBookingState = document.getElementById("emptyBookingState");
const bookingInfo = document.getElementById("bookingInfo");
const bookingStatus = document.getElementById("bookingStatus");
const adminNote = document.getElementById("adminNote");
const selectedBookingIdDisplay = document.getElementById("selectedBookingId");
const deleteBookingBtn = document.getElementById("deleteBookingBtn");
const copyBookingBtn = document.getElementById("copyBookingBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const seedBookingBtn = document.getElementById("seedBookingBtn");
const siteDetailsForm = document.getElementById("siteDetailsForm");
const resetSiteBtn = document.getElementById("resetSiteBtn");
const siteSaveMessage = document.getElementById("siteSaveMessage");

function isLoggedIn() {
  return sessionStorage.getItem(STORAGE_KEYS.session) === "true";
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  adminShell.classList.remove("hidden");
  renderAll();
}

function showLogin() {
  loginScreen.classList.remove("hidden");
  adminShell.classList.add("hidden");
}

if (isLoggedIn()) showDashboard();
else showLogin();

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("adminPassword")?.value || "";
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEYS.session, "true");
      showDashboard();
    } else {
      loginError.textContent = "Incorrect password. Try: nick2026";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(STORAGE_KEYS.session);
    showLogin();
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
  sideLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.tab === tabId);
  });
}

sideLinks.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

tabTriggers.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTrigger));
});

function getSiteDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.siteDetails) || "{}");
    return { ...(DEFAULTS.siteDetails || {}), ...saved };
  } catch (error) {
    return { ...(DEFAULTS.siteDetails || {}) };
  }
}

function saveSiteDetails(details) {
  localStorage.setItem(STORAGE_KEYS.siteDetails, JSON.stringify(details));
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || "[]");
  } catch (error) {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
}

function formatDate(dateValue) {
  if (!dateValue) return "Not set";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStatusOptions() {
  const statuses = ["All", ...(DEFAULTS.statuses || [])];
  if (statusFilter) {
    statusFilter.innerHTML = statuses.map((status) => `<option value="${status}">${status}</option>`).join("");
  }
  if (bookingStatus) {
    bookingStatus.innerHTML = (DEFAULTS.statuses || [])
      .map((status) => `<option value="${status}">${status}</option>`)
      .join("");
  }
}

function getFilteredBookings() {
  const bookings = getBookings();
  const search = (bookingSearch?.value || "").toLowerCase().trim();
  const status = statusFilter?.value || "All";

  return bookings.filter((booking) => {
    const matchesStatus = status === "All" || booking.status === status;
    const searchable = [
      booking.name,
      booking.phone,
      booking.eventType,
      booking.packageInterest,
      booking.eventDate,
      booking.message,
      booking.status
    ].join(" ").toLowerCase();
    return matchesStatus && (!search || searchable.includes(search));
  });
}

function renderStats() {
  const bookings = getBookings();
  const byStatus = (status) => bookings.filter((booking) => booking.status === status).length;
  const total = document.getElementById("totalBookings");
  const newCount = document.getElementById("newBookings");
  const confirmed = document.getElementById("confirmedBookings");
  const completed = document.getElementById("completedBookings");

  if (total) total.textContent = bookings.length;
  if (newCount) newCount.textContent = byStatus("New");
  if (confirmed) confirmed.textContent = byStatus("Confirmed");
  if (completed) completed.textContent = byStatus("Completed");
}

function renderRecentBookings() {
  const bookings = getBookings().slice(0, 5);
  if (!recentBookings) return;
  if (!bookings.length) {
    recentBookings.innerHTML = `<div class="empty-state">No bookings yet. Use the public website form or add a demo booking.</div>`;
    return;
  }
  recentBookings.innerHTML = bookings.map((booking) => `
    <div class="mini-item">
      <strong>${escapeHtml(booking.name)} — ${escapeHtml(booking.eventType)}</strong>
      <span>${formatDate(booking.createdAt)} • ${escapeHtml(booking.status)} • ${escapeHtml(booking.phone)}</span>
    </div>
  `).join("");
}

function renderBusinessSnapshot() {
  const site = getSiteDetails();
  if (!businessSnapshot) return;
  businessSnapshot.innerHTML = [
    ["Business", `${site.businessName} — ${site.businessSubtitle}`],
    ["Phone", `${site.phone1} | ${site.phone2}`],
    ["WhatsApp", `${site.whatsapp1} | ${site.whatsapp2}`],
    ["Email", site.email],
    ["Location", site.location],
    ["Socials", `Facebook: ${site.facebook} • Instagram: ${site.instagram}`]
  ].map(([label, value]) => `
    <div class="snapshot-item">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(value)}</span>
    </div>
  `).join("");
}

function renderBookingsTable() {
  const bookings = getFilteredBookings();
  if (!bookingsTable) return;
  if (!bookings.length) {
    bookingsTable.innerHTML = `
      <tr>
        <td colspan="6">No bookings match your current filter.</td>
      </tr>
    `;
    return;
  }

  bookingsTable.innerHTML = bookings.map((booking) => `
    <tr>
      <td>${formatDate(booking.createdAt)}</td>
      <td><span class="client-name">${escapeHtml(booking.name)}</span><br>${escapeHtml(booking.phone)}</td>
      <td>${escapeHtml(booking.eventType)}<br><small>${escapeHtml(booking.eventDate)}</small></td>
      <td>${escapeHtml(booking.packageInterest || "Not sure yet")}</td>
      <td><span class="status-pill">${escapeHtml(booking.status)}</span></td>
      <td><button class="row-action" type="button" data-booking-id="${escapeHtml(booking.id)}">Manage</button></td>
    </tr>
  `).join("");

  bookingsTable.querySelectorAll("[data-booking-id]").forEach((button) => {
    button.addEventListener("click", () => selectBooking(button.dataset.bookingId));
  });
}

function selectBooking(id) {
  selectedBookingId = id;
  const booking = getBookings().find((item) => item.id === id);
  if (!booking) return;

  if (selectedBookingIdDisplay) selectedBookingIdDisplay.textContent = booking.id;
  if (emptyBookingState) emptyBookingState.classList.add("hidden");
  if (bookingDetailsForm) bookingDetailsForm.classList.remove("hidden");
  if (bookingStatus) bookingStatus.value = booking.status || "New";
  if (adminNote) adminNote.value = booking.adminNote || "";
  if (bookingInfo) {
    bookingInfo.innerHTML = [
      ["Client", booking.name],
      ["Phone", booking.phone],
      ["Event Type", booking.eventType],
      ["Package", booking.packageInterest || "Not sure yet"],
      ["Event Date", booking.eventDate],
      ["Guests", booking.guests],
      ["Budget / Notes", booking.budget],
      ["Created", formatDate(booking.createdAt)],
      ["Message", booking.message, "full"]
    ].map(([label, value, wide]) => `
      <div class="info-box ${wide ? "full" : ""}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value || "Not provided")}</strong>
      </div>
    `).join("");
  }

  document.getElementById("bookingDetailsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

if (bookingSearch) bookingSearch.addEventListener("input", renderBookingsTable);
if (statusFilter) statusFilter.addEventListener("change", renderBookingsTable);

if (bookingDetailsForm) {
  bookingDetailsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const bookings = getBookings().map((booking) => {
      if (booking.id !== selectedBookingId) return booking;
      return {
        ...booking,
        status: bookingStatus?.value || booking.status,
        adminNote: adminNote?.value || ""
      };
    });
    saveBookings(bookings);
    renderAll();
    if (selectedBookingId) selectBooking(selectedBookingId);
  });
}

if (deleteBookingBtn) {
  deleteBookingBtn.addEventListener("click", () => {
    if (!selectedBookingId) return;
    const confirmed = confirm("Delete this booking request?");
    if (!confirmed) return;
    saveBookings(getBookings().filter((booking) => booking.id !== selectedBookingId));
    selectedBookingId = null;
    if (bookingDetailsForm) bookingDetailsForm.classList.add("hidden");
    if (emptyBookingState) emptyBookingState.classList.remove("hidden");
    if (selectedBookingIdDisplay) selectedBookingIdDisplay.textContent = "No booking selected";
    renderAll();
  });
}

if (copyBookingBtn) {
  copyBookingBtn.addEventListener("click", async () => {
    const booking = getBookings().find((item) => item.id === selectedBookingId);
    if (!booking) return;
    const text = [
      `Booking ID: ${booking.id}`,
      `Name: ${booking.name}`,
      `Phone: ${booking.phone}`,
      `Event Type: ${booking.eventType}`,
      `Package: ${booking.packageInterest}`,
      `Event Date: ${booking.eventDate}`,
      `Guests: ${booking.guests}`,
      `Budget/Notes: ${booking.budget}`,
      `Status: ${booking.status}`,
      `Message: ${booking.message}`,
      `Admin Note: ${booking.adminNote || ""}`
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      copyBookingBtn.textContent = "Copied";
      setTimeout(() => copyBookingBtn.textContent = "Copy Details", 1400);
    } catch (error) {
      alert(text);
    }
  });
}

function fillSiteForm() {
  if (!siteDetailsForm) return;
  const site = getSiteDetails();
  Object.entries(site).forEach(([key, value]) => {
    const field = siteDetailsForm.elements[key];
    if (field) field.value = value;
  });
}

if (siteDetailsForm) {
  siteDetailsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(siteDetailsForm);
    const details = { ...getSiteDetails() };
    formData.forEach((value, key) => {
      details[key] = String(value).trim();
    });
    saveSiteDetails(details);
    renderBusinessSnapshot();
    if (siteSaveMessage) {
      siteSaveMessage.textContent = "Website details saved. Open Preview Website to see the update.";
      setTimeout(() => siteSaveMessage.textContent = "", 3500);
    }
  });
}

if (resetSiteBtn) {
  resetSiteBtn.addEventListener("click", () => {
    const confirmed = confirm("Reset website details back to the original flyer information?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEYS.siteDetails);
    fillSiteForm();
    renderBusinessSnapshot();
  });
}

function exportBookingsCsv() {
  const bookings = getBookings();
  if (!bookings.length) {
    alert("There are no bookings to export yet.");
    return;
  }

  const headers = ["ID", "Created", "Name", "Phone", "Event Type", "Package", "Event Date", "Guests", "Budget", "Message", "Status", "Admin Note"];
  const rows = bookings.map((booking) => [
    booking.id,
    booking.createdAt,
    booking.name,
    booking.phone,
    booking.eventType,
    booking.packageInterest,
    booking.eventDate,
    booking.guests,
    booking.budget,
    booking.message,
    booking.status,
    booking.adminNote
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `events-with-nick-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportBookingsCsv);

if (seedBookingBtn) {
  seedBookingBtn.addEventListener("click", () => {
    const demo = {
      id: `EWN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: "Demo Client",
      phone: "076 000 0000",
      eventType: "Wedding",
      packageInterest: "Signature Coordination",
      eventDate: "Not confirmed yet",
      guests: "120",
      budget: "Quotation requested",
      message: "I need decor styling and coordination for a family wedding.",
      status: "New",
      adminNote: "Follow up with package options."
    };
    const bookings = getBookings();
    bookings.unshift(demo);
    saveBookings(bookings);
    renderAll();
    switchTab("bookings");
  });
}

function renderAll() {
  renderStatusOptions();
  renderStats();
  renderRecentBookings();
  renderBusinessSnapshot();
  renderBookingsTable();
  fillSiteForm();
}
