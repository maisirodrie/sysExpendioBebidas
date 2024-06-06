import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    //Encuestador
    apellidoenc: {
      type: String,
      trim: true,
    },
    nombreenc: {
      type: String,
      trim: true,
    },
    organismoenc: {
      type: String,
      trim: true,
    },
    celularen: {
      type: String,
      trim: true,
    },
    correoen: {
      type: String,
      trim: true,
    },

    //Datos personales de las y los responsables de la unidad productiva
    //Primer responsable
    nombreresp1: {
      type: String,
      trim: true,
    },
    apellidoresp1: {
      type: String,
      trim: true,
    },
    dniresp1: {
      type: String,
      trim: true,
    },
    cuitresp1: {
      type: String,
      trim: true,
    },
    celularresp1: {
      type: String,
      trim: true,
    },
    correoresp1: {
      type: String,
      trim: true,
    },
    estudiosresp1: {
      type: String,
      trim: true,
    },

    //Segundo responsable
    nombreresp2: {
      type: String,
      trim: true,
    },
    apellidoresp2: {
      type: String,
      trim: true,
    },
    dniresp2: {
      type: String,
      trim: true,
    },
    cuitresp2: {
      type: String,
      trim: true,
    },
    celularresp2: {
      type: String,
      trim: true,
    },
    correoresp2: {
      type: String,
      trim: true,
    },
    estudiosresp2: {
      type: String,
      trim: true,
    },

    // Datos del grupo familiar
    tieneintegrantes: {
      type: String, // Cambiar a String
      enum: ["SI", "NO"], // Validación para aceptar solo "SI" o "NO"
      trim: true,
    },
    cuantosintegrantes: {
      type: String,
      trim: true,
    },
    cantidadhijosgrupo: {
      type: String,
      trim: true,
    },
    convive: {
      type: String, // Cambiar a String
      enum: ["SI", "NO"], // Validación para aceptar solo "SI" o "NO"
      trim: true,
    },
    hijosasisten: {
      type: String,
      trim: true,
    },
    
    nivelinicialfamiliar:{
      type: String,
      trim: true,
    },
    primariafamiliar:{
      type: String,
      trim: true,
    },
    secundariafamiliar:{
      type: String,
      trim: true,
    },
    terciariaosuperiorfamiliar:{
      type: String,
      trim: true,
    },

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

export default mongoose.model("Task", tasksSchema);
