import express from "express";
import { body } from "express-validator";
import { getBookingChat, sendBookingMessage } from "../controllers/chatController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/booking/:bookingId", optionalAuth, getBookingChat);
router.post(
  "/booking/:bookingId/messages",
  optionalAuth,
  [
    body("senderName").optional({ checkFalsy: true }).trim(),
    body("text").trim().notEmpty().withMessage("Message is required")
  ],
  validateRequest,
  sendBookingMessage
);

export default router;
