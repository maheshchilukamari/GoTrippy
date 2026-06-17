import mongoose from "mongoose";

const selfDriveBookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    drivingLicenseNumber: {
      type: String,
      required: true,
      trim: true
    },
    pickupDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true
    },
    selectedCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SelfDriveCar",
      required: true
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    notes: {
      type: String,
      trim: true
    },
    documentNote: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

selfDriveBookingSchema.index({ pickupDate: 1, status: 1, selectedCar: 1 });

export default mongoose.model("SelfDriveBooking", selfDriveBookingSchema);
