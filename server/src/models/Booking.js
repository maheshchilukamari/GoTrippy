import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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
    pickupLocation: {
      type: String,
      required: true,
      trim: true
    },
    dropLocation: {
      type: String,
      required: true,
      trim: true
    },
    tripType: {
      type: String,
      enum: ["One Way", "Round Trip", "Local", "Airport", "Temple Trip", "Picnic", "Outstation"],
      required: true
    },
    travelDate: {
      type: Date,
      required: true
    },
    travelTime: {
      type: String,
      required: true
    },
    passengers: {
      type: Number,
      required: true,
      min: 1
    },
    preferredCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car"
    },
    selectedVehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car"
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent"
    },
    preferredCarName: {
      type: String,
      default: "Any Available Car"
    },
    assignedAgentName: {
      type: String,
      trim: true
    },
    assignedAgentPhone: {
      type: String,
      trim: true
    },
    additionalNotes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

bookingSchema.index({ travelDate: 1, status: 1, tripType: 1 });

export default mongoose.model("Booking", bookingSchema);
