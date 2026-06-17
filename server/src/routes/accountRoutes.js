import express from "express";
import { body } from "express-validator";
import { createAccount, getAccounts, getMyProfile, updateAccount } from "../controllers/accountController.js";
import { protect, requireAgentOrAdmin, requireSuperAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const accountValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").optional({ checkFalsy: true }).trim().matches(/^(91)?[6-9]\d{9}$/).withMessage("Enter a valid phone number"),
  body("role").isIn(["SUPER_ADMIN", "AGENT"]).withMessage("Invalid account role"),
  body("status").isIn(["ACTIVE", "INACTIVE", "SUSPENDED"]).withMessage("Invalid account status")
];

router.get("/me", protect, requireAgentOrAdmin, getMyProfile);
router.get("/", protect, requireSuperAdmin, getAccounts);
router.post(
  "/",
  protect,
  requireSuperAdmin,
  [
    ...accountValidators,
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  validateRequest,
  createAccount
);
router.put(
  "/:id",
  protect,
  requireSuperAdmin,
  [
    ...accountValidators,
    body("password").optional({ checkFalsy: true }).isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  validateRequest,
  updateAccount
);

export default router;
