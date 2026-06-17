import express from "express";
import { body } from "express-validator";
import {
  createAgent,
  deleteAgent,
  getAgentReports,
  getAgents,
  updateAgent
} from "../controllers/agentController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const phoneValidator = /^(91)?[6-9]\d{9}$/;

const agentValidators = [
  body("fullName").trim().notEmpty().withMessage("Agent full name is required"),
  body("mobileNumber").trim().matches(phoneValidator).withMessage("Enter a valid mobile number"),
  body("whatsappNumber").trim().matches(phoneValidator).withMessage("Enter a valid WhatsApp number"),
  body("alternateNumber")
    .optional({ checkFalsy: true })
    .trim()
    .matches(phoneValidator)
    .withMessage("Enter a valid alternate number"),
  body("licenseNumber").optional({ checkFalsy: true }).trim(),
  body("status").isIn(["Active", "Inactive"]).withMessage("Invalid driver status"),
  body("profilePhoto")
    .optional({ checkFalsy: true })
    .custom((value) => /^data:image\/(png|jpe?g|webp);base64,/i.test(value) || /^https?:\/\/\S+$/i.test(value))
    .withMessage("Upload a valid driver photo")
];

router.get("/", protect, adminOnly, getAgents);
router.get("/reports", protect, adminOnly, getAgentReports);
router.post("/", protect, adminOnly, agentValidators, validateRequest, createAgent);
router.put("/:id", protect, adminOnly, agentValidators, validateRequest, updateAgent);
router.delete("/:id", protect, adminOnly, deleteAgent);

export default router;
