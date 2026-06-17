import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    whatsappNumber: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    profilePhoto: {
      type: String,
      trim: true
    },
    passwordHash: {
      type: String,
      minlength: 8,
      select: false
    },
    password: {
      type: String,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "AGENT", "admin"],
      default: "AGENT"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (this.isModified("passwordHash") && this.passwordHash && !this.passwordHash.startsWith("$2")) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }

  if (this.isModified("password") && this.password && !this.password.startsWith("$2")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  const savedPassword = this.passwordHash || this.password;
  if (!savedPassword) return false;
  return bcrypt.compare(enteredPassword, savedPassword);
};

export default mongoose.model("User", userSchema);
