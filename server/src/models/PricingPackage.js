import mongoose from "mongoose";

const pricingPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "vehicleModel"
    },
    vehicleModel: {
      type: String,
      enum: ["Car", "SelfDriveCar"],
      default: "Car"
    },
    pricingType: {
      type: String,
      trim: true
    },
    pricePerKm: {
      type: Number,
      min: 0
    },
    pricePerDay: {
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
    outstationPackagePrice: {
      type: Number,
      min: 0
    },
    securityDeposit: {
      type: Number,
      min: 0
    },
    notes: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ["Per Kilometer", "Per Day", "Airport", "Temple", "Outstation", "Local", "Custom"],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    carType: {
      type: String,
      enum: ["Ertiga", "Swift", "Swift Dzire", "Both"],
      default: "Both"
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    inclusions: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("PricingPackage", pricingPackageSchema);
