import express from "express";
import { body } from "express-validator";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  getPublicBookingById,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { protect, requireAgentOrAdmin, requireSuperAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const bookingValidators = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("phoneNumber")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10 digit Indian mobile number"),
  body("pickupLocation").trim().notEmpty().withMessage("Pickup location is required"),
  body("dropLocation").trim().notEmpty().withMessage("Drop location is required"),
  body("tripType")
    .isIn(["One Way", "Round Trip", "Local", "Airport", "Temple Trip", "Picnic", "Outstation"])
    .withMessage("Invalid trip type"),
  body("travelDate").isISO8601().withMessage("Travel date is required"),
  body("travelTime").trim().notEmpty().withMessage("Travel time is required"),
  body("passengers").isInt({ min: 1 }).withMessage("Passengers must be at least 1"),
  body("selectedVehicleId").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid selected vehicle"),
  body("assignedAgentId").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid assigned agent"),
  body("preferredCarName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Invalid preferred car"),
  body("assignedAgentName").optional({ checkFalsy: true }).trim(),
  body("assignedAgentPhone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(91)?[6-9]\d{9}$/)
    .withMessage("Invalid assigned agent phone")
];

router.post("/", bookingValidators, validateRequest, createBooking);
router.get("/", protect, requireAgentOrAdmin, getBookings);
router.get("/public/:id", getPublicBookingById);
router.get("/:id", protect, requireAgentOrAdmin, getBookingById);
router.patch(
  "/:id/status",
  protect,
  requireAgentOrAdmin,
  body("status")
    .isIn(["Pending", "Confirmed", "Completed", "Cancelled"])
    .withMessage("Invalid status"),
  validateRequest,
  updateBookingStatus
);
router.delete("/:id", protect, requireSuperAdmin, deleteBooking);

export default router;
