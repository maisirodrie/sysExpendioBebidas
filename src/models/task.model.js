import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    expendio: { type: String, trim: true },
    persona: { type: String, trim: true },
    dni: {
      type: String,
      trim: true,
      unique: true, // El DNI debe ser único, ya que es un identificador
    },
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
    nroexpediente: {
      // **¡CORRECCIÓN CRÍTICA!**: Cambiado a un Array de Strings
      type: String, 
    trim: true,
      // Se elimina 'unique: true' ya que Mongoose lo aplica al array completo, 
      // y no es lo habitual cuando se almacenan múltiples expedientes.
      sparse: true, 
    },
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
      enum: ["ingresado", "pendiente", "controlado", "aprobado", "rechazado", "finalizado"],
      default: "ingresado",
    },
    motivoRechazo: {
      type: String,
    },
    pago: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Task", taskSchema);
