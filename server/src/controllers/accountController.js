import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import SelfDriveBooking from "../models/SelfDriveBooking.js";
import SelfDriveCar from "../models/SelfDriveCar.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const accountPayload = (account) => ({
  id: account._id,
  _id: account._id,
  name: account.name,
  email: account.email,
  phone: account.phone,
  role: account.role === "admin" ? "SUPER_ADMIN" : account.role,
  status: account.status || "ACTIVE",
  createdBy: account.createdBy,
  createdAt: account.createdAt
});

export const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await User.find({}).select("-password -passwordHash").sort({ createdAt: -1 });
  const [driverVehicleCounts, selfDriveVehicleCounts, driverBookingCounts, selfDriveBookingCounts] = await Promise.all([
    Car.aggregate([{ $match: { ownerAgentId: { $ne: null } } }, { $group: { _id: "$ownerAgentId", count: { $sum: 1 } } }]),
    SelfDriveCar.aggregate([{ $match: { ownerAgentId: { $ne: null } } }, { $group: { _id: "$ownerAgentId", count: { $sum: 1 } } }]),
    Booking.aggregate([{ $match: { agentId: { $ne: null } } }, { $group: { _id: "$agentId", count: { $sum: 1 } } }]),
    SelfDriveBooking.aggregate([{ $match: { agentId: { $ne: null } } }, { $group: { _id: "$agentId", count: { $sum: 1 } } }])
  ]);

  const sumCounts = (...groups) => {
    const map = new Map();
    groups.flat().forEach((item) => map.set(String(item._id), (map.get(String(item._id)) || 0) + item.count));
    return map;
  };

  const vehicleCounts = sumCounts(driverVehicleCounts, selfDriveVehicleCounts);
  const bookingCounts = sumCounts(driverBookingCounts, selfDriveBookingCounts);

  res.json(accounts.map((account) => ({
    ...accountPayload(account),
    vehicleCount: vehicleCounts.get(String(account._id)) || 0,
    bookingCount: bookingCounts.get(String(account._id)) || 0
  })));
});

export const createAccount = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });

  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const account = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    passwordHash: req.body.password,
    role: req.body.role,
    status: req.body.status || "ACTIVE",
    createdBy: req.user._id
  });

  res.status(201).json(accountPayload(account));
});

export const updateAccount = asyncHandler(async (req, res) => {
  const account = await User.findById(req.params.id).select("+passwordHash");

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  account.name = req.body.name ?? account.name;
  account.email = req.body.email ?? account.email;
  account.phone = req.body.phone ?? account.phone;
  account.role = req.body.role ?? account.role;
  account.status = req.body.status ?? account.status;

  if (req.body.password) {
    account.passwordHash = req.body.password;
  }

  await account.save();
  res.json(accountPayload(account));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  res.json({ user: accountPayload(req.user) });
});
