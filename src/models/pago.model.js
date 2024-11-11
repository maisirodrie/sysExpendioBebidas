// src/models/pago.model.js
import mongoose from "mongoose";


const pagoSchema = new mongoose.Schema({
    value: { type: Number, required: true }, // El valor del pago
  }, { timestamps: true });

export default mongoose.model("Pago", pagoSchema);
