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
      enum: ["admin", "user", "boss", "viewer"],
      default: "user",
    },
    // No necesitas el campo 'task' aquí, ya que se manejará la relación inversa desde el modelo 'Task'
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
