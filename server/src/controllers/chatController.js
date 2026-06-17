import Booking from "../models/Booking.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const canAccessBookingChat = (req, booking) => {
  if (!req.user) return true;
  if (["SUPER_ADMIN", "admin"].includes(req.user.role)) return true;
  return booking.agentId?.toString() === req.user._id.toString();
};

const findOrCreateChat = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("selectedVehicleId", "name")
    .populate("agentId", "name phone email role status");

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  const chat = await Chat.findOneAndUpdate(
    { bookingId: booking._id },
    {
      $setOnInsert: {
        bookingId: booking._id,
        customerName: booking.customerName,
        customerPhone: booking.phoneNumber,
        driverId: booking.agentId?._id,
        vehicleId: booking.selectedVehicleId?._id
      }
    },
    { new: true, upsert: true }
  ).populate("driverId", "name phone email role status");

  return { booking, chat };
};

export const getBookingChat = asyncHandler(async (req, res) => {
  const { booking, chat } = await findOrCreateChat(req.params.bookingId);

  if (!canAccessBookingChat(req, booking)) {
    res.status(403);
    throw new Error("You can view only your own booking chats");
  }

  const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
  res.json({ booking, chat, messages });
});

export const sendBookingMessage = asyncHandler(async (req, res) => {
  const { booking, chat } = await findOrCreateChat(req.params.bookingId);

  if (!canAccessBookingChat(req, booking)) {
    res.status(403);
    throw new Error("You can message only your own booking chats");
  }

  const senderRole = req.user
    ? req.user.role === "AGENT"
      ? "DRIVER"
      : "ADMIN"
    : "CUSTOMER";

  const message = await Message.create({
    chatId: chat._id,
    bookingId: booking._id,
    senderRole,
    senderId: req.user?._id,
    senderName: req.user?.name || req.body.senderName || booking.customerName,
    text: req.body.text
  });

  chat.lastMessage = message.text;
  if (senderRole === "CUSTOMER") chat.unreadForDriver += 1;
  if (senderRole === "DRIVER") chat.unreadForCustomer += 1;
  await chat.save();

  const io = req.app.get("io");
  io?.to(`booking:${booking._id}`).emit("chat:message", message);

  res.status(201).json(message);
});
