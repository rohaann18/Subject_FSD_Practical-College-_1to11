const express = require("express");
const path = require("path");
const { venues, recommendVenues } = require("./venues");

const app = express();
const PORT = process.env.PORT || 3000;
const eventTypes = ["Wedding", "Birthday", "Corporate", "Conference", "Party"];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/venues.js", (req, res) => res.sendFile(path.join(__dirname, "venues.js")));

app.get("/api/venues", (req, res) => {
  res.json({ success: true, count: venues.length, venues });
});

app.post("/api/suggest", (req, res) => {
  const { eventType, crowdSize } = req.body || {};
  const size = Number(crowdSize);

  if (!eventTypes.includes(eventType)) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid event type."
    });
  }

  if (!Number.isFinite(size) || size <= 0) {
    return res.status(400).json({
      success: false,
      message: "Crowd size must be a positive number."
    });
  }

  const matches = recommendVenues(eventType, size);

  const response = {
    success: true,
    count: matches.length,
    venues: matches
  };

  if (matches.length === 0) {
    response.message = "No exact venue found for this event and crowd size.";
  }

  res.json(response);
});

app.use((error, req, res, next) => {
  const isBadJson = error instanceof SyntaxError && error.status === 400;
  const status = isBadJson ? 400 : 500;
  const message = isBadJson ? "Please send valid JSON." : "Internal server error.";
  res.status(status).json({ success: false, message });
});

app.listen(PORT, () => {
  console.log(`EVENTORA is running at http://localhost:${PORT}`);
});
