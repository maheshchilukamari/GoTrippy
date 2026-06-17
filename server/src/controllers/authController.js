import User from "../models/User.js";
import DriverProfile from "../models/DriverProfile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password +passwordHash");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.status && user.status !== "ACTIVE") {
    res.status(403);
    throw new Error("This account is not active");
  }

  if (user.role === "admin") {
    user.role = "SUPER_ADMIN";
    user.status = "ACTIVE";
    await user.save();
  }

  res.json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    }
  });
});

export const registerDriver = asyncHandler(async (req, res) => {
  const { name, email, phone, whatsappNumber, city, password, profilePhoto } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    phone,
    whatsappNumber: whatsappNumber || phone,
    city,
    profilePhoto,
    passwordHash: password,
    role: "AGENT",
    status: "ACTIVE"
  });

  await DriverProfile.create({
    userId: user._id,
    fullName: name,
    phone,
    whatsappNumber: whatsappNumber || phone,
    email,
    city,
    profilePhoto,
    status: "ACTIVE"
  });

  res.status(201).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      whatsappNumber: user.whatsappNumber,
      city: user.city,
      role: user.role,
      status: user.status
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
