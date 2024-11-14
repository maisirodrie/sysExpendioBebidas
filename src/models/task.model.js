import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    nroexpediente: { type: String, required: true, trim: true  },
    expendio: { type: String, trim: true },
    persona: { type: String, trim: true },
    dni: { type: String, trim: true },
    apellido: { type: String, trim: true },
    nombre: { type: String, trim: true },
    localidad: { type: String, trim: true },
    domicilio: { type: String, trim: true },
    lugar: { type: String, trim: true },
    dias: { type: String, trim: true },
    horarios: { type: String, trim: true },
    tipoevento: { type: String, trim: true },
    email: { type: String, trim: true },
    contacto: { type: String, trim: true },
    nroHabilitacion: { type: String, trim: true },
    domicilioLocalComercial: { type: String, trim: true },
    rubro: { type: String, trim: true },
    horarioAtencion: { type: String, trim: true },
    habilitacionComercial: { type: String, trim: true },
    file: [
      {
        filename: String,
        bucketName: String,
        mimetype: String,
        encoding: String,
        id: mongoose.Schema.Types.ObjectId,
      },
    ],
    estado: {
      type: String,
      enum: ["pendiente", "controlado", "aprobado", "rechazado", "finalizado", "ingresado"],
      default: "ingresado",
    },
    pago: { type: Boolean, default: false }, // Campo de pago con valor por defecto false
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
