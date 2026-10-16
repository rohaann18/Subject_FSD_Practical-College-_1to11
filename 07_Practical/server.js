const express = require("express");
const path = require("path");
const { venues, recommendVenues } = require("./venues");
const app = express();
const PORT = process.env.PORT || 3000;
const supportedEventTypes = ["Company Meeting", "Birthday Celebration", "Music Concert"];
const supportedLocations = ["Ahmedabad", "Gandhinagar", "Vadodara", "Surat"];
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/venues.js", (req, res) => res.sendFile(path.join(__dirname, "venues.js")));
app.get("/api/venues", (req, res) => {
  res.json({ success: true, count: venues.length, venues });
});
app.post("/api/suggest", (req, res) => {
  const { eventType, location, crowdSize } = req.body || {};
  const numericCrowdSize = Number(crowdSize);
  if (!eventType) {
    return res.status(400).json({ success: false, message: "Please select an event type." });
  }
  if (!location) {
    return res.status(400).json({ success: false, message: "Please select a location." });
  }
  if (crowdSize === undefined || crowdSize === null || crowdSize === "") {
    return res.status(400).json({
      success: false,
      message: "Please enter a crowd size."
    });
  }
  if (!Number.isFinite(numericCrowdSize) || numericCrowdSize <= 0) {
    return res.status(400).json({ success: false, message: "Please enter a valid crowd size." });
  }
  if (!supportedEventTypes.includes(eventType)) {
    return res.status(400).json({
      success: false,
      message: "The selected event type is not supported."
    });
  }
  if (!supportedLocations.includes(location)) {
    return res.status(400).json({
      success: false,
      message: "The selected location is not supported."
    });
  }
  const suitableVenues = recommendVenues(eventType, location, numericCrowdSize);
  if (suitableVenues.length === 0) {
    return res.json({
      success: true,
      count: 0,
      venues: [],
      message: "No exact venue found for your event requirements."
    });
  }
  res.json({
    success: true,
    count: suitableVenues.length,
    venues: suitableVenues
  });
});
app.use((err, req, res, next) => {
  const malformedJson = err instanceof SyntaxError && err.status === 400;
  if (malformedJson) return res.status(400).json({ success: false, message: "Please send valid JSON." });
  console.error("Request error:", err.message);
  res.status(500).json({ success: false, message: "Unable to process the request right now." });
});
app.listen(PORT, () => {
  console.log(`EVENTORA PRO is running at http://localhost:${PORT}`);
});
