const venues = [
  {
    id: 1, name: "Executive Crown Hall",
    eventTypes: ["Company Meeting"],
    location: "Ahmedabad",
    minCapacity: 20, maxCapacity: 120,
    priceRange: "Premium",
    rating: 4.8,
    description: "A refined indoor venue designed for focused company meetings."
  },
  {
    id: 2, name: "Heritage Boardroom",
    eventTypes: ["Company Meeting", "Birthday Celebration"],
    location: "Ahmedabad",
    minCapacity: 50, maxCapacity: 180,
    priceRange: "Standard",
    rating: 4.6,
    description: "A flexible city venue with a formal setting and warm ambience."
  },
  {
    id: 3, name: "Capital Grove Pavilion",
    eventTypes: ["Company Meeting", "Birthday Celebration"],
    location: "Gandhinagar",
    minCapacity: 30, maxCapacity: 220,
    priceRange: "Premium",
    rating: 4.7,
    description: "An elegant pavilion suited to business sessions and celebrations."
  },
  {
    id: 4, name: "Golden Courtyard",
    eventTypes: ["Birthday Celebration"],
    location: "Gandhinagar",
    minCapacity: 80, maxCapacity: 300,
    priceRange: "Standard",
    rating: 4.5,
    description: "A spacious celebration hall with an inviting courtyard feel."
  },
  {
    id: 5, name: "Regal Cedar Studio",
    eventTypes: ["Company Meeting", "Birthday Celebration"],
    location: "Vadodara",
    minCapacity: 25, maxCapacity: 160,
    priceRange: "Value",
    rating: 4.4,
    description: "A polished studio for compact professional and social events."
  },
  {
    id: 6, name: "Crescendo Arena",
    eventTypes: ["Music Concert"],
    location: "Vadodara",
    minCapacity: 250, maxCapacity: 650,
    priceRange: "Premium",
    rating: 4.9,
    description: "A large performance venue planned for energetic music concerts."
  },
  {
    id: 7, name: "Pearl Celebration Hall",
    eventTypes: ["Birthday Celebration"],
    location: "Surat",
    minCapacity: 40, maxCapacity: 140,
    priceRange: "Standard",
    rating: 4.7,
    description: "A graceful hall for memorable birthdays and family gatherings."
  },
  {
    id: 8, name: "Diamond City Forum",
    eventTypes: ["Company Meeting", "Birthday Celebration"],
    location: "Surat",
    minCapacity: 90, maxCapacity: 260,
    priceRange: "Premium",
    rating: 4.6,
    description: "A contemporary forum for larger corporate and private events."
  },
  {
    id: 9, name: "Riverfront Rhythm Grounds",
    eventTypes: ["Music Concert"],
    location: "Ahmedabad",
    minCapacity: 300, maxCapacity: 1000,
    priceRange: "Premium",
    rating: 4.8,
    description: "An open event ground with room for major live performances."
  }
];
function recommendVenues(eventType, location, crowdSize) {
  const size = Number(crowdSize);
  return venues
    .filter((venue) =>
      venue.eventTypes.includes(eventType) &&
      venue.location === location &&
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
