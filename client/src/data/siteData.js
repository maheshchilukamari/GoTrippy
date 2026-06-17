export const business = {
  name: "GoTrippy",
  ownerName: "Mahesh Chilukamari",
  phone: import.meta.env.VITE_BUSINESS_PHONE || "8885863662",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "918885863662",
  serviceArea: "Telangana, Andhra Pradesh, Hyderabad Airport routes, temple circuits, and nearby outstation trips"
};

export const tripTypes = ["One Way", "Round Trip", "Local", "Airport", "Temple Trip", "Picnic", "Outstation"];

export const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

export const fallbackCars = [
  {
    _id: "ertiga",
    name: "Maruti Suzuki Ertiga",
    slug: "maruti-suzuki-ertiga",
    imageUrl: "https://imgd-ct.aeplcdn.com/664x415/n/b6j9ora_1420392.jpg?q=80",
    seatingCapacity: "6-7 passengers",
    luggageCapacity: "3 medium bags",
    idealUseCases: ["Family trips", "Temple trips", "Airport rides", "Outstation travel"],
    priceEstimate: "Best for full-day and long-distance packages",
    description:
      "Comfortable family MPV with extra seating and luggage room for darshan trips, airport travel, and long journeys."
  },
  {
    _id: "swift-dzire",
    name: "Maruti Suzuki Swift Dzire",
    slug: "maruti-suzuki-swift-dzire",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPHbvL0c1S7Ci_fagEsHlLk6pIyx2v6nVkjpDWbqeUzb2jqLiQt-I6cVZifNKmYFsEoP9mK1kpr-IxiepAwmkYYDUawCl6pamhRqZY-uasiT7cfgIuffnXvUApjRKJ0-oCWzdcLCz3feA/s16000/Swift-Dezire.png",
    seatingCapacity: "4 passengers",
    luggageCapacity: "2 small bags",
    idealUseCases: ["City rides", "Airport drops", "Short trips", "Small family travel"],
    priceEstimate: "Economical choice for local and short-distance rides",
    description:
      "Compact and efficient sedan for city travel, short family rides, and airport pickup or drop requirements."
  }
];

export const services = [
  {
    title: "Temple Trips",
    description:
      "Comfortable family cab services for temple visits across Telangana, Andhra Pradesh, and South India with flexible pickup and return schedules.",
    imageUrl:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Bright Hindu temple architecture for family pilgrimage trips"
  },
  {
    title: "Hyderabad Airport Pickup/Drop",
    description: "Reliable airport pickup and drop with phone coordination, luggage support, and fixed package options.",
    imageUrl:
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Modern airport terminal for Hyderabad airport pickup and drop service"
  },
  {
    title: "Picnic Trips",
    description: "Day packages for picnic spots, sightseeing, school holidays, and relaxed family outings.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Green family picnic destination near hills and open landscape"
  },
  {
    title: "Outstation Trips",
    description: "Comfortable intercity and multi-day travel with transparent package discussions before the ride.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Scenic highway route for long distance outstation road trips"
  },
  {
    title: "Local City Travel",
    description:
      "Convenient city rides across Hyderabad for shopping, hospital visits, railway stations, bus stands, office travel, sightseeing, and daily family transportation.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg",
    imageAlt: "Charminar Hyderabad daylight city travel landmark"
  },
  {
    title: "Custom Family Trips",
    description: "Plan your own route, stops, timings, and vehicle preference for family travel needs.",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Happy family travel experience for custom trip planning"
  }
];

export const fallbackSelfDriveCars = [
  {
    _id: "swift-self-drive",
    name: "Maruti Suzuki Swift Dzire Self Drive",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPHbvL0c1S7Ci_fagEsHlLk6pIyx2v6nVkjpDWbqeUzb2jqLiQt-I6cVZifNKmYFsEoP9mK1kpr-IxiepAwmkYYDUawCl6pamhRqZY-uasiT7cfgIuffnXvUApjRKJ0-oCWzdcLCz3feA/s16000/Swift-Dezire.png",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: "5 seats",
    pricePerDay: 2200,
    securityDeposit: 8000,
    requiredDocuments: ["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"],
    availabilityStatus: "Available"
  },
  {
    _id: "ertiga-self-drive",
    name: "Maruti Suzuki Ertiga Self Drive",
    imageUrl: "https://imgd-ct.aeplcdn.com/664x415/n/b6j9ora_1420392.jpg?q=80",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: "7 seats",
    pricePerDay: 3200,
    securityDeposit: 12000,
    requiredDocuments: ["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"],
    availabilityStatus: "Available"
  }
];

export const fallbackPricing = [
  {
    _id: "local-swift",
    title: "Local City Ride",
    category: "Per Kilometer",
    price: 16,
    unit: "per km",
    carType: "Swift Dzire",
    description: "Economical local travel inside city limits.",
    inclusions: ["Transparent kilometer billing", "Best for short city rides"]
  },
  {
    _id: "outstation-ertiga",
    title: "Family Outstation Ertiga",
    category: "Per Kilometer",
    price: 22,
    unit: "per km",
    carType: "Ertiga",
    description: "Comfortable pricing for long family routes.",
    inclusions: ["Spacious seating", "Ideal for temple and family travel"]
  },
  {
    _id: "airport",
    title: "Hyderabad Airport Drop",
    category: "Airport",
    price: 2800,
    unit: "fixed package",
    carType: "Both",
    description: "Sample fixed airport package, editable by admin.",
    inclusions: ["Phone coordination", "Luggage support"]
  }
];
