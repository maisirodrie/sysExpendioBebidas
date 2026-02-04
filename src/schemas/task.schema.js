import { z } from "zod";

export const creatTaskSchema = z.object({
  // Se valida que el número de expediente sea una cadena de texto opcional que contenga solo dígitos.
  nroexpediente: z
    .string()
    .regex(/^\d+$/, "El número de expediente debe contener solo dígitos.")
    .optional(),
  expendio: z.string({
    required_error: "El expendio es requerido",
  }),
  persona: z.string().optional(),
  // Se valida que el DNI sea una cadena de texto que contenga solo dígitos y tenga al menos 8 caracteres.
  dni: z
    .string({
      required_error: "El número de DNI es requerido",
    })
    .regex(/^\d+$/, "El DNI debe contener solo dígitos.")
    .min(8, "El DNI debe tener al menos 8 dígitos."),
  apellido: z.string({
    required_error: "El apellido es requerido",
  }),
  nombre: z.string({
    required_error: "El nombre es requerido",
  }),
  localidad: z.string({
    required_error: "La localidad es requerida",
  }),
  domicilio: z.string().optional(),
  lugar: z.string().optional(),
  dias: z.string().optional(),
  horarios: z.string().optional(),
  tipoevento: z.string().optional(),
  // Se usa z.string().email() para una validación de correo electrónico.
  email: z
    .string()
    .email("El email debe ser una dirección de correo válida.")
    .optional(),
  // Se valida que el contacto sea una cadena de texto que contenga solo dígitos.
  contacto: z
    .string({
      required_error: "El contacto es requerido",
    })
    .regex(/^\d+$/, "El número de contacto debe contener solo dígitos."),
  nroHabilitacion: z
    .string()
    .regex(/^\d+$/, "El número de habilitación debe contener solo dígitos.")
    .optional(),
  domicilioLocalComercial: z.string().optional(),
  rubro: z.string().optional(),
  horarioAtencion: z.string().optional(),
  habilitacionComercial: z.string().optional(),
  estado: z.string().optional().default("Ingresado"),
  motivoRechazo: z.string().optional(),
  pago: z.boolean().optional().default(false),
  file: z.any().optional(),
  user: z.string().optional(),
});
