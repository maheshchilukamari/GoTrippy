import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import PricingPackage from "../models/PricingPackage.js";
import SelfDriveBooking from "../models/SelfDriveBooking.js";
import SelfDriveCar from "../models/SelfDriveCar.js";
import User from "../models/User.js";

dotenv.config();

const migratePlatform = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@gotrippy.in";
  let superAdmin = await User.findOne({ email: adminEmail }).select("+password +passwordHash");

  if (!superAdmin) {
    superAdmin = await User.create({
      name: process.env.ADMIN_NAME || "GoTrippy Admin",
      email: adminEmail,
      phone: process.env.ADMIN_PHONE || "8885863662",
      passwordHash: process.env.ADMIN_PASSWORD || "ChangeMe123!",
      role: "SUPER_ADMIN",
      status: "ACTIVE"
    });
  } else {
    superAdmin.role = "SUPER_ADMIN";
    superAdmin.status = "ACTIVE";
    superAdmin.phone = superAdmin.phone || process.env.ADMIN_PHONE || "8885863662";
    if (!superAdmin.passwordHash && superAdmin.password) {
      superAdmin.passwordHash = superAdmin.password;
    }
    await superAdmin.save();
  }

  await Promise.all([
    Car.updateMany(
      { $or: [{ ownerAgentId: { $exists: false } }, { ownerAgentId: null }] },
      { ownerAgentId: superAdmin._id, category: "WITH_DRIVER", status: "ACTIVE" }
    ),
    SelfDriveCar.updateMany(
      { $or: [{ ownerAgentId: { $exists: false } }, { ownerAgentId: null }] },
      { ownerAgentId: superAdmin._id, category: "SELF_DRIVE", status: "ACTIVE" }
    ),
    PricingPackage.updateMany(
      { $or: [{ agentId: { $exists: false } }, { agentId: null }] },
      { agentId: superAdmin._id }
    )
  ]);

  const cars = await Car.find({ ownerAgentId: superAdmin._id }).select("_id");
  const selfDriveCars = await SelfDriveCar.find({ ownerAgentId: superAdmin._id }).select("_id");

  await Promise.all([
    Booking.updateMany(
      { selectedVehicleId: { $in: cars.map((car) => car._id) }, $or: [{ agentId: { $exists: false } }, { agentId: null }] },
      { agentId: superAdmin._id }
    ),
    SelfDriveBooking.updateMany(
      { selectedCar: { $in: selfDriveCars.map((car) => car._id) }, $or: [{ agentId: { $exists: false } }, { agentId: null }] },
      { agentId: superAdmin._id }
    )
  ]);

  console.log(`GoTrippy platform migration complete. Super Admin: ${superAdmin.email}`);
  await mongoose.disconnect();
};

migratePlatform().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
