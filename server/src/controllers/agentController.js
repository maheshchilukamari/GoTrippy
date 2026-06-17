import Agent from "../models/Agent.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAgents = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === "true";
  const filter = includeInactive ? {} : { status: "Active" };
  const agents = await Agent.find(filter).populate("assignedVehicles", "name slug registrationNumber isActive").sort({ fullName: 1 });
  res.json(agents);
});

export const createAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.create(req.body);
  res.status(201).json(agent);
});

export const updateAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("assignedVehicles", "name slug registrationNumber isActive");

  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }

  res.json(agent);
});

export const deleteAgent = asyncHandler(async (req, res) => {
  const activeVehicles = await Car.countDocuments({ assignedAgent: req.params.id, isActive: true });

  if (activeVehicles > 0) {
    res.status(400);
    throw new Error("Cannot delete an agent assigned to active vehicles");
  }

  const agent = await Agent.findByIdAndDelete(req.params.id);

  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }

  await Car.updateMany({ assignedAgent: req.params.id }, { $unset: { assignedAgent: "" }, isActive: false });
  res.json({ message: "Agent deleted" });
});

export const getAgentReports = asyncHandler(async (req, res) => {
  const [bookingsByAgent, vehiclesByAgent, mostBookedVehicle] = await Promise.all([
    Booking.aggregate([
      { $match: { assignedAgentId: { $ne: null } } },
      { $group: { _id: "$assignedAgentId", totalBookings: { $sum: 1 } } },
      { $sort: { totalBookings: -1 } }
    ]),
    Car.aggregate([
      { $match: { assignedAgent: { $ne: null }, isActive: true } },
      { $group: { _id: "$assignedAgent", activeVehicles: { $sum: 1 } } }
    ]),
    Booking.aggregate([
      { $match: { selectedVehicleId: { $ne: null } } },
      { $group: { _id: "$selectedVehicleId", totalBookings: { $sum: 1 } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 1 },
      { $lookup: { from: "cars", localField: "_id", foreignField: "_id", as: "vehicle" } },
      { $unwind: "$vehicle" },
      { $project: { totalBookings: 1, name: "$vehicle.name" } }
    ])
  ]);

  const agents = await Agent.find({}).select("fullName status");
  const vehicleMap = new Map(vehiclesByAgent.map((item) => [String(item._id), item.activeVehicles]));
  const bookingMap = new Map(bookingsByAgent.map((item) => [String(item._id), item.totalBookings]));

  const agentReports = agents.map((agent) => {
    const activeVehicles = vehicleMap.get(String(agent._id)) || 0;
    const totalBookings = bookingMap.get(String(agent._id)) || 0;

    return {
      agentId: agent._id,
      fullName: agent.fullName,
      status: agent.status,
      totalBookings,
      activeVehicles,
      revenue: 0,
      utilizationPercent: activeVehicles > 0 ? Math.min(100, Math.round((totalBookings / (activeVehicles * 30)) * 100)) : 0
    };
  });

  res.json({
    agents: agentReports,
    mostBookedVehicle: mostBookedVehicle[0] || null
  });
});
