const form = document.querySelector("#venue-form");
const eventTypeInput = document.querySelector("#event-type");
const crowdSizeInput = document.querySelector("#crowd-size");
const errorText = document.querySelector("#form-error");
const resultsGrid = document.querySelector("#results-grid");
const resultsHeading = document.querySelector("#results-heading");
const submitButton = form.querySelector("button");
const buttonText = submitButton.querySelector(".button-text");

function showMessage(title, message) {
  resultsGrid.textContent = "";
  const box = document.createElement("div");
  box.className = "empty-state";

  const symbol = document.createElement("span");
  symbol.className = "empty-symbol";
  symbol.textContent = "◇";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const text = document.createElement("p");
  text.textContent = message;

  box.append(symbol, heading, text);
  resultsGrid.appendChild(box);
}

function addText(parent, className, text, tag = "p") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  parent.appendChild(element);
}

function displayVenues(venues) {
  resultsGrid.textContent = "";
  resultsHeading.classList.add("visible");

  venues.forEach((venue) => {
    const card = document.createElement("article");
    card.className = "venue-card";

    const topline = document.createElement("div");
    topline.className = "venue-topline";
    addText(topline, "venue-location", venue.location);
    addText(topline, "venue-rating", `★ ${venue.rating}`);

    addText(card, "venue-name", venue.name, "h3");
    addText(card, "venue-description", venue.description);
    addText(card, "venue-types", venue.type.join(" · "));

    const details = document.createElement("div");
    details.className = "venue-detail";
    addText(details, "", `${venue.minCapacity}–${venue.maxCapacity} guests`, "span");
    addText(details, "", venue.priceRange, "span");

    card.prepend(topline);
    card.appendChild(details);
    resultsGrid.appendChild(card);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorText.textContent = "";

  const eventType = eventTypeInput.value;
  const crowdSize = Number(crowdSizeInput.value);

  if (!eventType) {
    errorText.textContent = "Please select an event type.";
    return;
  }

  if (!Number.isFinite(crowdSize) || crowdSize <= 0) {
    errorText.textContent = "Please enter a valid positive crowd size.";
    return;
  }

  submitButton.disabled = true;
  buttonText.textContent = "Finding Venues...";
  showMessage("Searching our collection...", "Matching your occasion and guest count.");

  try {
    let data;
    if (location.pathname.includes("/public/")) {
      const venues = window.VenueData.recommendVenues(eventType, crowdSize);
      data = { count: venues.length, venues };
    } else {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, crowdSize })
      });
      data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
    }

    if (data.count === 0) {
      resultsHeading.classList.remove("visible");
      showMessage("No exact venue found.", "Try changing the event type or guest count.");
    } else {
      displayVenues(data.venues);
    }
  } catch (error) {
    resultsHeading.classList.remove("visible");
    showMessage("Unable to find venues right now.", "Please try again.");
  } finally {
    submitButton.disabled = false;
    buttonText.textContent = "Suggest Venues";
  }
});
