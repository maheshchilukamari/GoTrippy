import Car from "../models/Car.js";
import Agent from "../models/Agent.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCars = asyncHandler(async (req, res) => {
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);
  const isAgent = req.user?.role === "AGENT";
  const includeInactive = (isSuperAdmin || isAgent) && req.query.includeInactive === "true";
  const filter = includeInactive
    ? {}
    : { isActive: true, status: "ACTIVE", category: "WITH_DRIVER" };

  if (isAgent && includeInactive) {
    filter.ownerAgentId = req.user._id;
  }

  const cars = await Car.find(filter)
    .populate("assignedAgent", "fullName mobileNumber whatsappNumber status")
    .populate("ownerAgentId", "name phone whatsappNumber email city role status")
    .sort({ createdAt: -1 });
  res.json(includeInactive ? cars : cars.filter((car) => !car.assignedAgent || car.assignedAgent.status === "Active"));
});

export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id)
    .populate("assignedAgent", "fullName mobileNumber whatsappNumber status")
    .populate("ownerAgentId", "name phone whatsappNumber email city role status");

  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  res.json(car);
});

export const createCar = asyncHandler(async (req, res) => {
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);
  const payload = {
    ...req.body,
    category: "WITH_DRIVER",
    ownerAgentId: isSuperAdmin ? req.body.ownerAgentId || req.user._id : req.user._id,
    status: req.body.status || "ACTIVE",
    isActive: req.body.isActive !== false
  };

  if (payload.assignedAgent) {
    const agent = await Agent.findById(payload.assignedAgent);

    if (!agent || agent.status !== "Active") {
      res.status(400);
      throw new Error("Assigned driver/agent must be active");
    }
  }

  const car = await Car.create(payload);
  if (car.assignedAgent) {
    await Agent.findByIdAndUpdate(car.assignedAgent, { $addToSet: { assignedVehicles: car._id } });
  }
  res.status(201).json(car);
});

export const updateCar = asyncHandler(async (req, res) => {
  const existingCar = await Car.findById(req.params.id);
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);

  if (!existingCar) {
    res.status(404);
    throw new Error("Car not found");
  }

  if (!isSuperAdmin && existingCar.ownerAgentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can edit only your own vehicles");
  }

  const payload = {
    ...req.body,
    category: "WITH_DRIVER",
    ownerAgentId: isSuperAdmin ? req.body.ownerAgentId || existingCar.ownerAgentId || req.user._id : existingCar.ownerAgentId,
    status: req.body.status || existingCar.status || "ACTIVE",
    isActive: req.body.isActive !== false
  };

  if (payload.assignedAgent) {
    const agent = await Agent.findById(payload.assignedAgent);

    if (!agent || agent.status !== "Active") {
      res.status(400);
      throw new Error("Assigned driver/agent must be active");
    }
  }

  const previousAgent = existingCar.assignedAgent?.toString();
  const nextAgent = payload.assignedAgent || null;
  const car = await Car.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  })
    .populate("assignedAgent", "fullName mobileNumber whatsappNumber status")
    .populate("ownerAgentId", "name phone whatsappNumber email city role status");

  if (previousAgent && previousAgent !== nextAgent) {
    await Agent.findByIdAndUpdate(previousAgent, { $pull: { assignedVehicles: car._id } });
  }

  if (nextAgent) {
    await Agent.findByIdAndUpdate(nextAgent, { $addToSet: { assignedVehicles: car._id } });
  }

  res.json(car);
});

export const deleteCar = asyncHandler(async (req, res) => {
  const existingCar = await Car.findById(req.params.id);
  const isSuperAdmin = ["SUPER_ADMIN", "admin"].includes(req.user?.role);

  if (!existingCar) {
    res.status(404);
    throw new Error("Car not found");
  }

  if (!isSuperAdmin && existingCar.ownerAgentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can delete only your own vehicles");
  }

  const car = await Car.findByIdAndDelete(req.params.id);

  if (car.assignedAgent) {
    await Agent.findByIdAndUpdate(car.assignedAgent, { $pull: { assignedVehicles: car._id } });
  }

  res.json({ message: "Car deleted" });
});
