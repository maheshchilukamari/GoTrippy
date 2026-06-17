import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    customerName: {
      type: String,
      trim: true
    },
    customerPhone: {
      type: String,
      trim: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car"
    },
    lastMessage: {
      type: String,
      trim: true
    },
    unreadForDriver: {
      type: Number,
      default: 0
    },
    unreadForCustomer: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
