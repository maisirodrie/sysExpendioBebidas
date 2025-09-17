import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin","editor", "user", "viewer","mesa","juridicos"],
      default: "user",
    },
    mustChangePassword: {
        type: Boolean,
        default: false,
    },
    // 🚨 ¡Añade estos dos campos!
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);