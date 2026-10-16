const form = document.getElementById("venue-form");
const eventTypeInput = document.getElementById("event-type");
const locationInput = document.getElementById("location");
const crowdSizeInput = document.getElementById("crowd-size");
const submitButton = document.getElementById("submit-button");
const formMessage = document.getElementById("form-message");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");
function showEmptyState(title, message) {
  results.replaceChildren();
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  const symbol = document.createElement("span");
  symbol.className = "empty-symbol";
  symbol.textContent = "E";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  emptyState.append(symbol, heading, paragraph);
  results.appendChild(emptyState);
}
function addDetail(container, label, value) {
  const row = document.createElement("div");
  row.className = "venue-detail";
  const detailLabel = document.createElement("span");
  detailLabel.textContent = label;
  const detailValue = document.createElement("span");
  detailValue.textContent = value;
  row.append(detailLabel, detailValue);
  container.appendChild(row);
}
function createVenueCard(venue) {
  const card = document.createElement("article");
  card.className = "venue-card";
  const topLine = document.createElement("div");
  topLine.className = "venue-topline";
  const location = document.createElement("span");
  location.textContent = venue.location;
  const rating = document.createElement("span");
  rating.className = "rating";
  rating.textContent = `★ ${venue.rating}`;
  const name = document.createElement("h3");
  name.textContent = venue.name;
  const description = document.createElement("p");
  description.className = "venue-description";
  description.textContent = venue.description;
  const details = document.createElement("div");
  details.className = "venue-details";
  addDetail(details, "Suitable for", venue.eventTypes.join(", "));
  addDetail(details, "Capacity", `${venue.minCapacity}–${venue.maxCapacity} guests`);
  addDetail(details, "Price range", venue.priceRange);
  topLine.append(location, rating);
  card.append(topLine, name, description, details);
  return card;
}
function displayVenues(venues) {
  results.replaceChildren();
  resultCount.textContent = `${venues.length} suitable venue${venues.length === 1 ? "" : "s"}`;
  venues.forEach((venue) => {
    results.appendChild(createVenueCard(venue));
  });
}
function validateForm(eventType, location, crowdSize) {
  if (!eventType) {
    return "Please select an event type.";
  }
  if (!location) {
    return "Please select a location.";
  }
  if (!Number.isFinite(crowdSize) || crowdSize <= 0) {
    return "Please enter a valid crowd size.";
  }
  return "";
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const eventType = eventTypeInput.value;
  const location = locationInput.value;
  const crowdSize = Number(crowdSizeInput.value);
  const validationMessage = validateForm(eventType, location, crowdSize);
  formMessage.textContent = validationMessage;
  if (validationMessage) {
    return;
  }
  submitButton.disabled = true;
  submitButton.textContent = "Finding Venue...";
  formMessage.textContent = "";
  resultCount.textContent = "Searching...";
  try {
    let data;
    if (window.location.pathname.includes("/public/")) {
      const venues = window.VenueData.recommendVenues(eventType, location, crowdSize);
      data = { count: venues.length, venues };
    } else {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, location, crowdSize })
      });
      data = await response.json();
      if (!response.ok) {
        formMessage.textContent = data.message || "Please check your event details.";
        resultCount.textContent = "";
        return;
      }
    }
    if (data.count === 0) {
      resultCount.textContent = "0 suitable venues";
      showEmptyState(
        "No exact venue found.",
        "Try changing the location, event type or guest count."
      );
      return;
    }
    displayVenues(data.venues);
    document.querySelector(".results-section").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    resultCount.textContent = "";
    showEmptyState(
      "Unable to find venues right now.",
      "Please try again."
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Find Suitable Venue";
  }
});
