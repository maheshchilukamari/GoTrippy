import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildBookingFilters = (query) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.tripType) filter.tripType = query.tripType;
  if (query.car) filter.preferredCarName = query.car;
  if (query.agent) filter.assignedAgentId = query.agent;
  if (query.date) {
    const start = new Date(query.date);
    const end = new Date(query.date);
    end.setDate(end.getDate() + 1);
    filter.travelDate = { $gte: start, $lt: end };
  }

  return filter;
};

export const createBooking = asyncHandler(async (req, res) => {
  const selectedVehicle = req.body.selectedVehicleId
    ? await Car.findById(req.body.selectedVehicleId)
      .populate("assignedAgent", "fullName whatsappNumber mobileNumber status")
      .populate("ownerAgentId", "name phone whatsappNumber email city role status")
    : await Car.findOne({ name: req.body.preferredCarName })
      .populate("assignedAgent", "fullName whatsappNumber mobileNumber status")
      .populate("ownerAgentId", "name phone whatsappNumber email city role status");

  if (selectedVehicle) {
    if (!selectedVehicle.isActive || selectedVehicle.status !== "ACTIVE") {
      res.status(400);
      throw new Error("Selected vehicle is not available for new bookings");
    }

    if (selectedVehicle.assignedAgent && selectedVehicle.assignedAgent.status !== "Active") {
      res.status(400);
      throw new Error("Selected vehicle agent is inactive. Please choose another vehicle");
    }
  }

  const booking = await Booking.create({
    ...req.body,
    preferredCar: selectedVehicle?._id || req.body.preferredCar,
    selectedVehicleId: selectedVehicle?._id || req.body.selectedVehicleId,
    agentId: selectedVehicle?.ownerAgentId?._id || req.body.agentId,
    preferredCarName: selectedVehicle?.name || req.body.preferredCarName,
    assignedAgentId: selectedVehicle?.assignedAgent?._id || req.body.assignedAgentId,
    assignedAgentName: selectedVehicle?.assignedAgent?.fullName || selectedVehicle?.ownerAgentId?.name || req.body.assignedAgentName,
    assignedAgentPhone: selectedVehicle?.assignedAgent?.whatsappNumber || selectedVehicle?.ownerAgentId?.whatsappNumber || selectedVehicle?.ownerAgentId?.phone || req.body.assignedAgentPhone
  });

  await booking.populate([
    { path: "selectedVehicleId", select: "name registrationNumber ownerAgentId" },
    { path: "agentId", select: "name phone whatsappNumber email city role status" },
    { path: "assignedAgentId", select: "fullName whatsappNumber mobileNumber status" }
  ]);

  res.status(201).json({
    message: "Booking request submitted successfully",
    booking
  });
});

export const getBookings = asyncHandler(async (req, res) => {
  const filter = buildBookingFilters(req.query);
  if (req.user?.role === "AGENT") {
    filter.agentId = req.user._id;
  }

  const bookings = await Booking.find(filter)
    .populate("preferredCar", "name seatingCapacity")
    .populate("selectedVehicleId", "name registrationNumber")
    .populate("agentId", "name phone whatsappNumber email city role status")
    .populate("assignedAgentId", "fullName whatsappNumber mobileNumber status")
    .sort({ travelDate: -1, createdAt: -1 });

  res.json(bookings);
});

export const getPublicBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("selectedVehicleId", "name registrationNumber imageUrl seatingCapacity")
    .populate("agentId", "name phone whatsappNumber email city role status");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json({
    _id: booking._id,
    customerName: booking.customerName,
    phoneNumber: booking.phoneNumber,
    pickupLocation: booking.pickupLocation,
    dropLocation: booking.dropLocation,
    tripType: booking.tripType,
    travelDate: booking.travelDate,
    travelTime: booking.travelTime,
    passengers: booking.passengers,
    preferredCarName: booking.preferredCarName,
    selectedVehicleId: booking.selectedVehicleId,
    agentId: booking.agentId,
    assignedAgentName: booking.assignedAgentName,
    assignedAgentPhone: booking.assignedAgentPhone,
    status: booking.status,
    createdAt: booking.createdAt
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("preferredCar", "name seatingCapacity")
    .populate("selectedVehicleId", "name registrationNumber")
    .populate("agentId", "name phone whatsappNumber email city role status")
    .populate("assignedAgentId", "fullName whatsappNumber mobileNumber status");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (req.user?.role === "AGENT" && booking.agentId?._id?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can view only your own bookings");
  }

  res.json(booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (req.user?.role === "AGENT" && booking.agentId?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can update only your own bookings");
  }

  booking.status = req.body.status;
  await booking.save();
  await booking.populate([
    { path: "preferredCar", select: "name seatingCapacity" },
    { path: "selectedVehicleId", select: "name registrationNumber" },
    { path: "agentId", select: "name phone whatsappNumber email city role status" },
    { path: "assignedAgentId", select: "fullName whatsappNumber mobileNumber status" }
  ]);

  res.json(booking);
});

export const deleteBooking = asyncHandler(async (req, res) => {
  if (req.user?.role === "AGENT") {
    res.status(403);
    throw new Error("Agents cannot delete bookings");
  }

  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json({ message: "Booking deleted" });
});
