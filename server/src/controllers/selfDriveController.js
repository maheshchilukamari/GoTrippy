import SelfDriveBooking from "../models/SelfDriveBooking.js";
import SelfDriveCar from "../models/SelfDriveCar.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSelfDriveCars = asyncHandler(async (req, res) => {
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);
  const isAgent = req.user?.role === "AGENT";
  const includeInactive = (isSuperAdmin || isAgent) && req.query.includeInactive === "true";
  const filter = includeInactive ? {} : { isActive: true, status: "ACTIVE", availabilityStatus: "Available" };
  if (isAgent && includeInactive) filter.ownerAgentId = req.user._id;
  const cars = await SelfDriveCar.find(filter).populate("ownerAgentId", "name phone email role status").sort({ createdAt: -1 });
  res.json(cars);
});

export const createSelfDriveCar = asyncHandler(async (req, res) => {
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);
  const car = await SelfDriveCar.create({
    ...req.body,
    ownerAgentId: isSuperAdmin ? req.body.ownerAgentId || req.user._id : req.user._id,
    status: req.body.status || "ACTIVE",
    isActive: req.body.isActive !== false
  });
  res.status(201).json(car);
});

export const updateSelfDriveCar = asyncHandler(async (req, res) => {
  const existing = await SelfDriveCar.findById(req.params.id);
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);

  if (!existing) {
    res.status(404);
    throw new Error("Self-drive car not found");
  }

  if (!isSuperAdmin && existing.ownerAgentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can edit only your own self-drive cars");
  }

  const car = await SelfDriveCar.findByIdAndUpdate(req.params.id, {
    ...req.body,
    ownerAgentId: isSuperAdmin ? req.body.ownerAgentId || existing.ownerAgentId || req.user._id : existing.ownerAgentId,
    status: req.body.status || existing.status || "ACTIVE",
    isActive: req.body.isActive !== false
  }, {
    new: true,
    runValidators: true
  }).populate("ownerAgentId", "name phone email role status");

  if (!car) {
    res.status(404);
    throw new Error("Self-drive car not found");
  }

  res.json(car);
});

export const deleteSelfDriveCar = asyncHandler(async (req, res) => {
  const existing = await SelfDriveCar.findById(req.params.id);
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);

  if (!existing) {
    res.status(404);
    throw new Error("Self-drive car not found");
  }

  if (!isSuperAdmin && existing.ownerAgentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can delete only your own self-drive cars");
  }

  const activeBookings = await SelfDriveBooking.countDocuments({
    selectedCar: req.params.id,
    status: { $in: ["Pending", "Approved"] }
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error("Cannot delete a car with pending or approved self-drive bookings");
  }

  const car = await SelfDriveCar.findByIdAndDelete(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error("Self-drive car not found");
  }

  res.json({ message: "Self-drive car deleted" });
});

export const createSelfDriveBooking = asyncHandler(async (req, res) => {
  const car = await SelfDriveCar.findById(req.body.selectedCar).populate("ownerAgentId", "name phone email role status");

  if (!car || !car.isActive || car.status !== "ACTIVE" || car.availabilityStatus !== "Available") {
    res.status(400);
    throw new Error("Selected self-drive car is not available");
  }

  const pickupDate = new Date(req.body.pickupDate);
  const returnDate = new Date(req.body.returnDate);

  if (returnDate < pickupDate) {
    res.status(400);
    throw new Error("Return date must be after pickup date");
  }

  const booking = await SelfDriveBooking.create({
    ...req.body,
    agentId: car.ownerAgentId?._id
  });
  await booking.populate([
    { path: "selectedCar", select: "name fuelType transmission seatingCapacity pricePerDay securityDeposit availabilityStatus ownerAgentId" },
    { path: "agentId", select: "name phone email role status" }
  ]);

  res.status(201).json({
    message: "Self-drive booking request submitted successfully",
    booking
  });
});

export const getSelfDriveBookings = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.car) filter.selectedCar = req.query.car;
  if (req.user?.role === "AGENT") filter.agentId = req.user._id;

  const bookings = await SelfDriveBooking.find(filter)
    .populate("selectedCar", "name fuelType transmission seatingCapacity pricePerDay securityDeposit availabilityStatus")
    .populate("agentId", "name phone email role status")
    .sort({ pickupDate: -1, createdAt: -1 });

  res.json(bookings);
});

export const updateSelfDriveBookingStatus = asyncHandler(async (req, res) => {
  const booking = await SelfDriveBooking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Self-drive booking not found");
  }

  if (req.user?.role === "AGENT" && booking.agentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can update only your own self-drive bookings");
  }

  booking.status = req.body.status;
  await booking.save();
  await booking.populate([
    { path: "selectedCar", select: "name fuelType transmission seatingCapacity pricePerDay securityDeposit availabilityStatus" },
    { path: "agentId", select: "name phone email role status" }
  ]);

  res.json(booking);
});
