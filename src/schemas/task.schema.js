import { z } from 'zod';

export const creatTaskSchema = z.object({
  expe: z.string({
    required_error: "El número de expediente es requerido",
  }),
  correlativo: z.string({
    required_error: "El número del correlativo es requerido",
  }),
  anio: z.string({
    required_error: "El año es requerido",
  }),
  cuerpo: z.string({
    required_error: "El cuerpo es requerido",
  }),
  fecha: z.string({
    required_error: "La fecha es requerida",
  }),
  iniciador: z.string({
    required_error: "El iniciador es requerido",
  }),
  asunto: z.string({
    required_error: "El asunto es requerido",
  }),
  archivo: z.any().optional(), // Correcta utilización de optional
});
