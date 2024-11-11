import mongoose from "mongoose";
// src/controllers/pago.controller.js
import Pago from "../models/pago.model.js";

export const getPago = async (req, res) => {
  try {
    const pago = await Pago.findOne(); // Obtiene el único valor de Pago
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el valor de Pago" });
  }
};



export const updatePago = async (req, res) => {
  try {
    const { value } = req.body;
    const pago = await Pago.findOneAndUpdate({}, { value }, { new: true });
    res.json(pago);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el valor de Pago" });
  }
};



// Crear un nuevo valor de Pago
export const createPago = async (req, res) => {
    try {
      const { value } = req.body;
  
      // Verificar si el valor recibido es un número
      if (typeof value !== 'number' || isNaN(value)) {
        return res.status(400).json({ message: "El valor debe ser un número válido" });
      }
  
      // Verifica si ya existe un valor de Pago en la base de datos
      const existingPago = await Pago.findOne();
      if (existingPago) {
        return res.status(400).json({ message: "Ya existe un valor de Pago en la base de datos." });
      }
  
      // Si no existe, crea un nuevo valor de Pago
      const nuevoPago = new Pago({ value });
      await nuevoPago.save();
      res.status(201).json(nuevoPago); // Devuelve el nuevo Pago creado
    } catch (error) {
      console.error(error);  // Log para ayudar a depurar
      res.status(500).json({ message: "Error al crear el valor de Pago" });
    }
  };
