export const agents = [
  {
    key: "mahesh",
    fullName: "Mahesh Chilukamari",
    mobileNumber: "8885863662",
    whatsappNumber: "918885863662",
    alternateNumber: "",
    licenseNumber: "",
    status: "Active",
    profilePhoto: ""
  }
];

export const cars = [
  {
    name: "Maruti Suzuki Ertiga",
    slug: "maruti-suzuki-ertiga",
    imageUrl: "https://imgd-ct.aeplcdn.com/664x415/n/b6j9ora_1420392.jpg?q=80",
    registrationNumber: "TS09AB1234",
    assignedAgentKey: "mahesh",
    seatingCapacity: "6-7 passengers",
    luggageCapacity: "3 medium bags",
    idealUseCases: ["Family trips", "Temple trips", "Airport rides", "Outstation travel"],
    priceEstimate: "Best for full-day and long-distance packages",
    description:
      "A comfortable MPV for families who want extra seating, luggage space, and a relaxed ride for temple visits and outstation journeys."
  },
  {
    name: "Maruti Suzuki Swift Dzire",
    slug: "maruti-suzuki-swift-dzire",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPHbvL0c1S7Ci_fagEsHlLk6pIyx2v6nVkjpDWbqeUzb2jqLiQt-I6cVZifNKmYFsEoP9mK1kpr-IxiepAwmkYYDUawCl6pamhRqZY-uasiT7cfgIuffnXvUApjRKJ0-oCWzdcLCz3feA/s16000/Swift-Dezire.png",
    registrationNumber: "TS09CD5678",
    assignedAgentKey: "mahesh",
    seatingCapacity: "4 passengers",
    luggageCapacity: "2 small bags",
    idealUseCases: ["City rides", "Airport drops", "Short trips", "Small family travel"],
    priceEstimate: "Economical choice for local and short-distance rides",
    description:
      "A compact, efficient sedan for quick airport drops, local city rides, and short family travel with lower running cost."
  }
];

export const pricingPackages = [
  {
    title: "Local City Ride",
    category: "Per Kilometer",
    price: 16,
    unit: "per km",
    carType: "Swift Dzire",
    description: "Affordable local travel inside the city for shopping, hospital visits, and family errands.",
    inclusions: ["Driver allowance included for short rides", "Transparent kilometer-based billing"]
  },
  {
    title: "Family Outstation Ertiga",
    category: "Per Kilometer",
    price: 22,
    unit: "per km",
    carType: "Ertiga",
    description: "Comfortable outstation pricing for family trips and long-distance travel.",
    inclusions: ["Spacious 6-7 passenger seating", "Ideal for temple and family routes"]
  },
  {
    title: "Hyderabad Airport Drop",
    category: "Airport",
    price: 2800,
    unit: "fixed package",
    carType: "Both",
    description: "Fixed-price pickup or drop package for Hyderabad airport travel from service areas.",
    inclusions: ["Pickup reminders", "Luggage friendly", "Toll and parking billed as applicable"]
  },
  {
    title: "Temple Trip Package",
    category: "Temple",
    price: 4500,
    unit: "starting from",
    carType: "Ertiga",
    description: "Sample package for full-day darshan trips with family-friendly scheduling.",
    inclusions: ["Flexible waiting time", "Route support", "Clean family cab"]
  },
  {
    title: "Full Day Picnic",
    category: "Per Day",
    price: 5500,
    unit: "per day",
    carType: "Both",
    description: "A full-day package for picnic spots, local sightseeing, and custom family plans.",
    inclusions: ["Up to 10 hours", "Custom stops", "Driver allowance included"]
  }
];

export const selfDriveCars = [
  {
    name: "Maruti Suzuki Swift Dzire Self Drive",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPHbvL0c1S7Ci_fagEsHlLk6pIyx2v6nVkjpDWbqeUzb2jqLiQt-I6cVZifNKmYFsEoP9mK1kpr-IxiepAwmkYYDUawCl6pamhRqZY-uasiT7cfgIuffnXvUApjRKJ0-oCWzdcLCz3feA/s16000/Swift-Dezire.png",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: "5 seats",
    pricePerDay: 2200,
    securityDeposit: 8000,
    requiredDocuments: ["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"],
    availabilityStatus: "Available",
    isActive: true
  },
  {
    name: "Maruti Suzuki Ertiga Self Drive",
    imageUrl: "https://imgd-ct.aeplcdn.com/664x415/n/b6j9ora_1420392.jpg?q=80",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: "7 seats",
    pricePerDay: 3200,
    securityDeposit: 12000,
    requiredDocuments: ["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"],
    availabilityStatus: "Available",
    isActive: true
  }
];
