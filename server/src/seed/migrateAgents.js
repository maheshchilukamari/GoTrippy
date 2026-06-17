import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Agent from "../models/Agent.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

dotenv.config();

const defaultAgent = {
  fullName: process.env.DEFAULT_AGENT_NAME || "Mahesh Chilukamari",
  mobileNumber: process.env.DEFAULT_AGENT_MOBILE || "8885863662",
  whatsappNumber: process.env.DEFAULT_AGENT_WHATSAPP || "918885863662",
  status: "Active"
};

const migrateAgents = async () => {
  await connectDB();

  const agent = await Agent.findOneAndUpdate(
    { whatsappNumber: defaultAgent.whatsappNumber },
    { $setOnInsert: defaultAgent },
    { new: true, upsert: true }
  );

  const cars = await Car.find({
    $or: [{ assignedAgent: { $exists: false } }, { assignedAgent: null }]
  });

  for (const car of cars) {
    car.assignedAgent = agent._id;
    car.agentName = undefined;
    car.agentPhone = undefined;
    await car.save();
  }

  const assignedVehicleIds = await Car.find({ assignedAgent: agent._id }).distinct("_id");
  agent.assignedVehicles = assignedVehicleIds;
  await agent.save();

  await Booking.updateMany(
    {
      $or: [{ assignedAgentId: { $exists: false } }, { assignedAgentId: null }]
    },
    {
      assignedAgentId: agent._id,
      assignedAgentName: agent.fullName,
      assignedAgentPhone: agent.whatsappNumber
    }
  );

  console.log(`Agent migration complete. ${cars.length} vehicle(s) linked to ${agent.fullName}.`);
  await mongoose.disconnect();
};

migrateAgents().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
