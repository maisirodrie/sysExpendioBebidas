import { z } from "zod";

export const creatTaskSchema = z.object({
  nroexpediente:z.string().optional(),
  expendio: z.string({
    required_error: "El expendio es requerido",
  }),
  persona: z.string({
    required_error: "La persona es requerida",
  }),
  dni: z.string({
    required_error: "El número de DNI es requerido",
  }),
  apellido: z.string({
    required_error: "El apellido es requerido",
  }),
  nombre: z.string({
    required_error: "El nombre es requerido",
  }),
  localidad: z.string({
    required_error: "La localidad es requerida",
  }),
  domicilio: z.string().optional(), // Opcional si aplica
  lugar: z.string().optional(),
  dias: z.string().optional(), // Opcional si aplica
  horarios: z.string().optional(), // Opcional si aplica
  tipoevento: z.string().optional(), // Opcional si aplica
  email: z.string({
    message: "El email debe ser válido",
  }),
  contacto: z.string({
    required_error: "El contacto es requerido",
  }),
  nroHabilitacion: z.string().optional(), // Opcional si aplica
  domicilioLocalComercial: z.string().optional(), // Opcional si aplica
  rubro: z.string().optional(), // Opcional si aplica
  horarioAtencion: z.string().optional(), // Opcional si aplica
  habilitacionComercial: z.string().optional(), // Opcional si aplica
  estado: z.string().optional().default("Ingresado"),
  file: z.any().optional(), // Correcta utilización de optional
  user: z.string().optional(),
});
