import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true
    },
    alternateNumber: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },
    profilePhoto: {
      type: String,
      default: ""
    },
    assignedVehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);
