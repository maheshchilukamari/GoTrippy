import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Agent from "../models/Agent.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import ContactMessage from "../models/ContactMessage.js";
import PricingPackage from "../models/PricingPackage.js";
import SelfDriveBooking from "../models/SelfDriveBooking.js";
import SelfDriveCar from "../models/SelfDriveCar.js";
import User from "../models/User.js";
import { agents, cars, pricingPackages, selfDriveCars } from "./seedData.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    Booking.deleteMany({}),
    Agent.deleteMany({}),
    Car.deleteMany({}),
    ContactMessage.deleteMany({}),
    PricingPackage.deleteMany({}),
    SelfDriveBooking.deleteMany({}),
    SelfDriveCar.deleteMany({})
  ]);

  const createdAgents = await Agent.insertMany(agents.map(({ key, ...agent }) => agent));
  const agentByKey = new Map(agents.map((agent, index) => [agent.key, createdAgents[index]._id]));
  const carsToCreate = cars.map(({ assignedAgentKey, ...car }) => ({
    ...car,
    assignedAgent: agentByKey.get(assignedAgentKey)
  }));
  const createdCars = await Car.insertMany(carsToCreate);

  for (const car of createdCars) {
    if (car.assignedAgent) {
      await Agent.findByIdAndUpdate(car.assignedAgent, { $addToSet: { assignedVehicles: car._id } });
    }
  }

  await PricingPackage.insertMany(pricingPackages);
  await SelfDriveCar.insertMany(selfDriveCars);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@gotrippy.in";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const superAdmin = await User.create({
      name: process.env.ADMIN_NAME || "Mahesh Chilukamari",
      email: adminEmail,
      passwordHash: process.env.ADMIN_PASSWORD || "ChangeMe123!",
      role: "SUPER_ADMIN",
      status: "ACTIVE"
    });

    await Promise.all([
      Car.updateMany({}, { ownerAgentId: superAdmin._id, status: "ACTIVE", category: "WITH_DRIVER" }),
      PricingPackage.updateMany({}, { agentId: superAdmin._id }),
      SelfDriveCar.updateMany({}, { ownerAgentId: superAdmin._id, status: "ACTIVE", category: "SELF_DRIVE" })
    ]);
  }

  console.log("Seed data inserted successfully.");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
