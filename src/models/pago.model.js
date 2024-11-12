import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  unidaduf: {
    type: Number,
    required: true,
  },
  valoruf: {
    type: Number,
    required: true,
  },
  valortotal: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Pago", pagoSchema);
