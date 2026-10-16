const venues = [
  {
    id: 1,
    name: "Regal Crown Banquet",
    type: ["Wedding", "Party"],
    minCapacity: 120,
    maxCapacity: 500,
    location: "City Center",
    priceRange: "Premium",
    rating: 4.8,
    description: "An elegant banquet hall designed for grand celebrations."
  },
  {
    id: 2,
    name: "Emerald Grand Lawn",
    type: ["Wedding", "Birthday", "Party"],
    minCapacity: 250,
    maxCapacity: 900,
    location: "Riverside Avenue",
    priceRange: "Premium",
    rating: 4.7,
    description: "A spacious green lawn for memorable open-air occasions."
  },
  {
    id: 3,
    name: "Skyline Terrace",
    type: ["Birthday", "Corporate", "Party"],
    minCapacity: 40,
    maxCapacity: 150,
    location: "Central District",
    priceRange: "High",
    rating: 4.6,
    description: "A stylish rooftop setting with an impressive city view."
  },
  {
    id: 4,
    name: "Summit Conference Hall",
    type: ["Corporate", "Conference"],
    minCapacity: 70,
    maxCapacity: 300,
    location: "Knowledge Park",
    priceRange: "Moderate",
    rating: 4.7,
    description: "A professional hall with a focused and refined atmosphere."
  },
  {
    id: 5,
    name: "The Executive Forum",
    type: ["Corporate", "Conference"],
    minCapacity: 20,
    maxCapacity: 100,
    location: "Business Square",
    priceRange: "Moderate",
    rating: 4.5,
    description: "A smart business venue suited to meetings and seminars."
  },
  {
    id: 6,
    name: "Velvet Party Lounge",
    type: ["Birthday", "Party"],
    minCapacity: 30,
    maxCapacity: 120,
    location: "West End",
    priceRange: "High",
    rating: 4.6,
    description: "An intimate lounge with a lively yet sophisticated mood."
  },
  {
    id: 7,
    name: "Harmony Community Hall",
    type: ["Wedding", "Birthday", "Conference"],
    minCapacity: 80,
    maxCapacity: 350,
    location: "Garden Colony",
    priceRange: "Affordable",
    rating: 4.3,
    description: "A welcoming, versatile hall for value-conscious events."
  },
  {
    id: 8,
    name: "Pearl Celebration Studio",
    type: ["Birthday", "Corporate", "Party"],
    minCapacity: 10,
    maxCapacity: 60,
    location: "Lake Road",
    priceRange: "Affordable",
    rating: 4.4,
    description: "A charming small hall for close-knit celebrations."
  }
];

function recommendVenues(eventType, crowdSize) {
  const size = Number(crowdSize);
  return venues
    .filter((venue) =>
      venue.type.includes(eventType) &&
      size >= venue.minCapacity &&
      size <= venue.maxCapacity
    )
    .sort((a, b) =>
      a.maxCapacity - size - (b.maxCapacity - size) || b.rating - a.rating
    );
}

const venueData = { venues, recommendVenues };

if (typeof module !== "undefined") module.exports = venueData;
if (typeof window !== "undefined") window.VenueData = venueData;
