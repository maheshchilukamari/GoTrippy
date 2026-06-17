import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  if (user.status && user.status !== "ACTIVE") {
    res.status(403);
    throw new Error("Account is not active");
  }

  if (user.role === "admin") {
    user.role = "SUPER_ADMIN";
  }

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch {
    req.user = null;
  }

  next();
});

export const requireAuth = protect;

export const requireSuperAdmin = (req, res, next) => {
  if (!["SUPER_ADMIN", "admin"].includes(req.user?.role)) {
    res.status(403);
    throw new Error("Super admin access required");
  }

  next();
};

export const requireAgentOrAdmin = (req, res, next) => {
  if (!["SUPER_ADMIN", "admin", "AGENT"].includes(req.user?.role)) {
    res.status(403);
    throw new Error("Partner access required");
  }

  next();
};

export const adminOnly = requireSuperAdmin;
