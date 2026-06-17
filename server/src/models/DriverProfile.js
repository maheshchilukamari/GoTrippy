import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    profilePhoto: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    totalTrips: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
