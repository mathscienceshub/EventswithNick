const STORAGE_KEYS = {
  siteDetails: "ewnSiteDetails",
  bookings: "ewnBookings"
};

const DEFAULTS = window.EWN_DEFAULTS || {};

function getSiteDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.siteDetails) || "{}");
    return { ...(DEFAULTS.siteDetails || {}), ...saved };
  } catch (error) {
    return { ...(DEFAULTS.siteDetails || {}) };
  }
}

function normalisePhone(phone = "") {
  const cleaned = String(phone).replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("27")) return cleaned;
  if (cleaned.startsWith("0")) return `27${cleaned.slice(1)}`;
  return cleaned;
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

function createWhatsAppUrl(message) {
  const site = getSiteDetails();
  const phone = normalisePhone(site.whatsapp1 || site.phone1 || "0761864166");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function createQuickWhatsAppText() {
  const site = getSiteDetails();
  return `Hello ${site.businessName || "Events with Nick"}, I would like to book an event.`;
}

function updatePublicSiteDetails() {
  const site = getSiteDetails();

  document.querySelectorAll("[data-site]").forEach((item) => {
    const key = item.dataset.site;
    if (site[key]) item.textContent = site[key];
  });

  const phone1 = document.getElementById("phoneLink1");
  const phone2 = document.getElementById("phoneLink2");
  const email = document.getElementById("emailLink");
  const map = document.getElementById("mapLink");
  const facebook = document.getElementById("facebookLink");
  const instagram = document.getElementById("instagramLink");

  if (phone1) phone1.href = `tel:+${normalisePhone(site.phone1)}`;
  if (phone2) phone2.href = `tel:+${normalisePhone(site.phone2)}`;
  if (email) email.href = `mailto:${site.email}`;
  if (map) map.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location || "")}`;
  if (facebook) facebook.href = `https://www.facebook.com/${String(site.facebook || "").replace(/^@/, "")}`;
  if (instagram) instagram.href = `https://www.instagram.com/${String(site.instagram || "").replace(/^@/, "")}`;

  ["navWhatsApp", "heroWhatsApp", "floatingWhatsApp"].forEach((id) => {
    const link = document.getElementById(id);
    if (link) link.href = createWhatsAppUrl(createQuickWhatsAppText());
  });
}

function populateSelectOptions() {
  const eventType = document.getElementById("eventType");
  const packageInterest = document.getElementById("packageInterest");

  if (eventType) {
    eventType.innerHTML = `<option value="">Select event type</option>` +
      (DEFAULTS.eventTypes || []).map((type) => `<option value="${type}">${type}</option>`).join("");
  }

  if (packageInterest) {
    packageInterest.innerHTML = `<option value="">Not sure yet</option>` +
      (DEFAULTS.packages || []).map((pkg) => `<option value="${pkg}">${pkg}</option>`).join("");
  }
}

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");
const bookingForm = document.getElementById("bookingForm");
const packageButtons = document.querySelectorAll(".package-btn");
const bookingAlert = document.getElementById("bookingAlert");

if (year) {
  year.textContent = new Date().getFullYear();
}

updatePublicSiteDetails();
populateSelectOptions();

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function buildBookingRecord() {
  return {
    id: `EWN-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name: document.getElementById("fullName")?.value.trim() || "",
    phone: document.getElementById("phoneNumber")?.value.trim() || "",
    eventType: document.getElementById("eventType")?.value || "",
    packageInterest: document.getElementById("packageInterest")?.value || "Not sure yet",
    eventDate: document.getElementById("eventDate")?.value || "Not confirmed yet",
    guests: document.getElementById("guestCount")?.value || "Not confirmed yet",
    budget: document.getElementById("budget")?.value.trim() || "Not provided",
    message: document.getElementById("eventMessage")?.value.trim() || "I would like to request more information.",
    status: "New",
    adminNote: ""
  };
}

function buildWhatsAppMessage(booking) {
  const site = getSiteDetails();
  return [
    `Hello ${site.businessName || "Events with Nick"}, I would like to book an event.`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Event Type: ${booking.eventType}`,
    `Package Interest: ${booking.packageInterest}`,
    `Event Date: ${booking.eventDate}`,
    `Estimated Guests: ${booking.guests}`,
    `Budget/Notes: ${booking.budget}`,
    `Message: ${booking.message}`
  ].join("\n");
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const booking = buildBookingRecord();
    const bookings = getBookings();
    bookings.unshift(booking);
    saveBookings(bookings);

    if (bookingAlert) {
      bookingAlert.textContent = "Booking request saved. WhatsApp is opening now.";
    }

    window.open(createWhatsAppUrl(buildWhatsAppMessage(booking)), "_blank", "noopener");
    bookingForm.reset();
    populateSelectOptions();
  });
}

packageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const packageName = button.dataset.package || "Event package";
    const packageSelect = document.getElementById("packageInterest");
    const message = document.getElementById("eventMessage");
    const contactSection = document.getElementById("contact");

    if (packageSelect) packageSelect.value = packageName;

    if (message && !message.value.trim()) {
      message.value = `I am interested in the ${packageName} package. Please send me more details and a quotation.`;
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
