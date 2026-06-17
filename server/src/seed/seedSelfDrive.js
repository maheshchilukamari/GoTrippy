import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import SelfDriveCar from "../models/SelfDriveCar.js";
import { selfDriveCars } from "./seedData.js";

dotenv.config();

const seedSelfDrive = async () => {
  await connectDB();

  let inserted = 0;

  for (const car of selfDriveCars) {
    const existing = await SelfDriveCar.findOne({ name: car.name });

    if (!existing) {
      await SelfDriveCar.create(car);
      inserted += 1;
    }
  }

  console.log(`Self-drive seed complete. ${inserted} car(s) added.`);
  await mongoose.disconnect();
};

seedSelfDrive().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
