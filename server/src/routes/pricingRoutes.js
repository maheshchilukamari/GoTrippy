import express from "express";
import { body } from "express-validator";
import {
  createPricingPackage,
  deletePricingPackage,
  getPricingPackages,
  updatePricingPackage
} from "../controllers/pricingController.js";
import { optionalAuth, protect, requireAgentOrAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const pricingValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("category")
    .isIn(["Per Kilometer", "Per Day", "Airport", "Temple", "Outstation", "Local", "Custom"])
    .withMessage("Invalid category"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("unit").trim().notEmpty().withMessage("Unit is required"),
  body("carType").isIn(["Ertiga", "Swift", "Swift Dzire", "Both"]).withMessage("Invalid car type"),
  body("description").trim().notEmpty().withMessage("Description is required")
];

router.get("/", optionalAuth, getPricingPackages);
router.post("/", protect, requireAgentOrAdmin, pricingValidators, validateRequest, createPricingPackage);
router.put("/:id", protect, requireAgentOrAdmin, pricingValidators, validateRequest, updatePricingPackage);
router.delete("/:id", protect, requireAgentOrAdmin, deletePricingPackage);

export default router;
