import mongoose from "mongoose";

const selfDriveCarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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
    imageUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["SELF_DRIVE"],
      default: "SELF_DRIVE"
    },
    ownerAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    fuelType: {
      type: String,
      required: true,
      trim: true
    },
    transmission: {
      type: String,
      required: true,
      trim: true
    },
    seatingCapacity: {
      type: String,
      required: true,
      trim: true
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },
    requiredDocuments: {
      type: [String],
      default: ["Valid Driving License", "Aadhaar Card", "PAN Card or Passport", "Security Deposit"]
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable", "Maintenance"],
      default: "Available"
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

export default mongoose.model("SelfDriveCar", selfDriveCarSchema);
