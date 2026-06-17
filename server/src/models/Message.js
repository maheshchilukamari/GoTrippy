import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    senderRole: {
      type: String,
      enum: ["CUSTOMER", "DRIVER", "ADMIN"],
      default: "CUSTOMER"
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    senderName: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    readAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
