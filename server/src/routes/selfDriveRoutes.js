import express from "express";
import { body } from "express-validator";
import {
  createSelfDriveBooking,
  createSelfDriveCar,
  deleteSelfDriveCar,
  getSelfDriveBookings,
  getSelfDriveCars,
  updateSelfDriveBookingStatus,
  updateSelfDriveCar
} from "../controllers/selfDriveController.js";
import { optionalAuth, protect, requireAgentOrAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const imageValidator = (value) => {
  const isRemoteUrl = /^https?:\/\/\S+$/i.test(value);
  const isUploadedImage = /^data:image\/(png|jpe?g|webp);base64,/i.test(value);
  return isRemoteUrl || isUploadedImage;
};

const selfDriveCarValidators = [
  body("name").trim().notEmpty().withMessage("Car name is required"),
  body("imageUrl").custom(imageValidator).withMessage("Upload a valid car image"),
  body("fuelType").trim().notEmpty().withMessage("Fuel type is required"),
  body("transmission").trim().notEmpty().withMessage("Transmission type is required"),
  body("seatingCapacity").trim().notEmpty().withMessage("Seating capacity is required"),
  body("pricePerDay").isFloat({ min: 0 }).withMessage("Price per day is required"),
  body("securityDeposit").isFloat({ min: 0 }).withMessage("Security deposit is required"),
  body("requiredDocuments").optional().isArray().withMessage("Required documents must be a list"),
  body("availabilityStatus").isIn(["Available", "Unavailable", "Maintenance"]).withMessage("Invalid availability status"),
  body("isActive").optional().isBoolean().withMessage("Invalid active status")
];

const selfDriveBookingValidators = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("phoneNumber").trim().matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10 digit Indian mobile number"),
  body("drivingLicenseNumber").trim().notEmpty().withMessage("Driving license number is required"),
  body("pickupDate").isISO8601().withMessage("Pickup date is required"),
  body("returnDate").isISO8601().withMessage("Return date is required"),
  body("pickupLocation").trim().notEmpty().withMessage("Pickup location is required"),
  body("selectedCar").isMongoId().withMessage("Select a self-drive car"),
  body("notes").optional({ checkFalsy: true }).trim(),
  body("documentNote").optional({ checkFalsy: true }).trim()
];

router.get("/cars", optionalAuth, getSelfDriveCars);
router.post("/cars", protect, requireAgentOrAdmin, selfDriveCarValidators, validateRequest, createSelfDriveCar);
router.put("/cars/:id", protect, requireAgentOrAdmin, selfDriveCarValidators, validateRequest, updateSelfDriveCar);
router.delete("/cars/:id", protect, requireAgentOrAdmin, deleteSelfDriveCar);

router.post("/bookings", selfDriveBookingValidators, validateRequest, createSelfDriveBooking);
router.get("/bookings", protect, requireAgentOrAdmin, getSelfDriveBookings);
router.patch(
  "/bookings/:id/status",
  protect,
  requireAgentOrAdmin,
  body("status").isIn(["Pending", "Approved", "Rejected", "Completed"]).withMessage("Invalid self-drive status"),
  validateRequest,
  updateSelfDriveBookingStatus
);

export default router;
