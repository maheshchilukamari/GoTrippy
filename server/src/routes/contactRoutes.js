import express from "express";
import { body } from "express-validator";
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
  markContactMessageRead
} from "../controllers/contactController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("phone")
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Enter a valid 10 digit Indian mobile number"),
    body("email").optional({ checkFalsy: true }).isEmail().withMessage("Valid email is required"),
    body("message").trim().notEmpty().withMessage("Message is required")
  ],
  validateRequest,
  createContactMessage
);

router.get("/", protect, adminOnly, getContactMessages);
router.patch("/:id/read", protect, adminOnly, body("isRead").isBoolean(), validateRequest, markContactMessageRead);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

export default router;
