import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      default: "Car",
      trim: true
    },
    registrationNumber: {
      type: String,
      trim: true
    },
    fuelType: {
      type: String,
      default: "Petrol",
      trim: true
    },
    transmission: {
      type: String,
      default: "Manual",
      trim: true
    },
    acType: {
      type: String,
      enum: ["AC", "Non-AC"],
      default: "AC"
    },
    vehicleCategory: {
      type: String,
      enum: ["Hatchback", "Sedan", "SUV", "MPV", "Tempo Traveller", "Luxury", "Other"],
      default: "Sedan"
    },
    serviceType: {
      type: String,
      enum: ["With Driver", "Self Drive", "Both"],
      default: "With Driver"
    },
    category: {
      type: String,
      enum: ["WITH_DRIVER", "SELF_DRIVE"],
      default: "WITH_DRIVER"
    },
    ownerAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent"
    },
    assignedDriverName: {
      type: String,
      trim: true
    },
    assignedDriverPhone: {
      type: String,
      trim: true
    },
    agentName: {
      type: String,
      trim: true
    },
    agentPhone: {
      type: String,
      trim: true
    },
    seatingCapacity: {
      type: String,
      required: true
    },
    luggageCapacity: {
      type: String,
      required: true
    },
    idealUseCases: {
      type: [String],
      default: []
    },
    priceEstimate: {
      type: String,
      required: true
    },
    pricePerKm: {
      type: Number,
      min: 0
    },
    minimumFare: {
      type: Number,
      min: 0
    },
    dailyRentalPrice: {
      type: Number,
      min: 0
    },
    securityDeposit: {
      type: Number,
      min: 0
    },
    airportFixedPrice: {
      type: Number,
      min: 0
    },
    templePackagePrice: {
      type: Number,
      min: 0
    },
    pickupCity: {
      type: String,
      trim: true
    },
    serviceAreas: {
      type: [String],
      default: []
    },
    popularRoutes: {
      type: [String],
      default: []
    },
    availableDates: {
      type: [String],
      default: []
    },
    instantBooking: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ["PENDING_APPROVAL", "ACTIVE", "INACTIVE", "REJECTED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
