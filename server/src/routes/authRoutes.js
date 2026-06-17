import express from "express";
import { body } from "express-validator";
import { getMe, loginAdmin, registerDriver } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  loginAdmin
);

router.post(
  "/register-driver",
  [
    body("name").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").trim().matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10 digit phone number"),
    body("whatsappNumber").optional({ checkFalsy: true }).trim().matches(/^(91)?[6-9]\d{9}$/).withMessage("Enter a valid WhatsApp number"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("profilePhoto").optional({ checkFalsy: true }).trim()
  ],
  validateRequest,
  registerDriver
);

router.get("/me", protect, getMe);

export default router;
