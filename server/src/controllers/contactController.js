import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.create(req.body);
  res.status(201).json({
    message: "Message sent successfully",
    contactMessage
  });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

export const markContactMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead },
    { new: true, runValidators: true }
  );

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  res.json(message);
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  res.json({ message: "Contact message deleted" });
});
