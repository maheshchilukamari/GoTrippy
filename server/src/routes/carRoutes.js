import express from "express";
import { body } from "express-validator";
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  updateCar
} from "../controllers/carController.js";
import { optionalAuth, protect, requireAgentOrAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const carValidators = [
  body("name").trim().notEmpty().withMessage("Car name is required"),
  body("slug").trim().notEmpty().withMessage("Slug is required"),
  body("registrationNumber").optional({ checkFalsy: true }).trim(),
  body("fuelType").optional({ checkFalsy: true }).trim(),
  body("transmission").optional({ checkFalsy: true }).trim(),
  body("acType").optional({ checkFalsy: true }).isIn(["AC", "Non-AC"]).withMessage("Invalid AC type"),
  body("vehicleCategory").optional({ checkFalsy: true }).isIn(["Hatchback", "Sedan", "SUV", "MPV", "Tempo Traveller", "Luxury", "Other"]).withMessage("Invalid vehicle category"),
  body("serviceType").optional({ checkFalsy: true }).isIn(["With Driver", "Self Drive", "Both"]).withMessage("Invalid service type"),
  body("assignedAgent").optional({ checkFalsy: true }).isMongoId().withMessage("Assigned driver/agent is required"),
  body("imageUrl")
    .custom((value) => {
      const isRemoteUrl = /^https?:\/\/\S+$/i.test(value);
      const isUploadedImage = /^data:image\/(png|jpe?g|webp);base64,/i.test(value);
      return isRemoteUrl || isUploadedImage;
    })
    .withMessage("Upload a valid image file"),
  body("seatingCapacity").trim().notEmpty().withMessage("Seating capacity is required"),
  body("luggageCapacity").trim().notEmpty().withMessage("Luggage capacity is required"),
  body("priceEstimate").trim().notEmpty().withMessage("Price estimate is required"),
  body("pricePerKm").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Invalid per kilometer price"),
  body("minimumFare").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Invalid minimum fare"),
  body("dailyRentalPrice").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Invalid daily rental price"),
  body("securityDeposit").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Invalid security deposit"),
  body("airportFixedPrice").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Invalid airport fixed price"),
  body("templePackagePrice").optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Invalid temple package price"),
  body("pickupCity").optional({ checkFalsy: true }).trim(),
  body("serviceAreas").optional().isArray().withMessage("Service areas must be a list"),
  body("popularRoutes").optional().isArray().withMessage("Popular routes must be a list"),
  body("description").trim().notEmpty().withMessage("Description is required")
];

router.get("/", optionalAuth, getCars);
router.get("/:id", getCarById);
router.post("/", protect, requireAgentOrAdmin, carValidators, validateRequest, createCar);
router.put("/:id", protect, requireAgentOrAdmin, carValidators, validateRequest, updateCar);
router.delete("/:id", protect, requireAgentOrAdmin, deleteCar);

export default router;
