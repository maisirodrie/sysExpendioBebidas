import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    expe: {
      type: String,
      trim: true,
    },
    correlativo: {
      type: String,
      trim: true,
    },
    anio: {
      type: String,
      trim: true,
    },
    cuerpo: {
      type: String,
      trim: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    iniciador: {
      type: String,
      trim: true,
    },
    asunto: {
      type: String,
      trim: true,
    },
    file: [{
      filename: String,
      bucketName: String,
      mimetype: String,
      encoding: String,
      id: mongoose.Schema.Types.ObjectId
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
