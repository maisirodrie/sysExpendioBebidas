import mongoose from "mongoose";

const deletedTaskSchema = new mongoose.Schema(
  {
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
    nroexpediente: { type: String, trim: true },
    file: [
      {
        filename: String,
        bucketName: String,
        mimetype: String,
        encoding: String,
        fieldname: String,
        originalname: String,
        id: mongoose.Schema.Types.ObjectId,
      },
    ],
    estado: {
      type: String,
      enum: ["ingresado", "pendiente", "controlado", "aprobado", "rechazado", "finalizado"],
      default: "ingresado",
    },
    motivoRechazo: { type: String },
    motivoAprobacion: { type: String },
    pago: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Metadatos de auditoría de eliminación
    originalTaskId: { type: mongoose.Schema.Types.ObjectId },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedByName: { type: String, trim: true },
    deletedByEmail: { type: String, trim: true },
    deletedByRole: { type: String, trim: true },
    deletedAt: { type: Date, default: Date.now },
    deletionReason: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "deleted_tasks",
  }
);

export default mongoose.model("DeletedTask", deletedTaskSchema);
