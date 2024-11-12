import { z } from "zod";

export const updatePagoSchema = z.object({
  unidaduf: z.number().min(0, { message: "El valor debe ser un número positivo" }),
  valoruf: z.number().min(0, { message: "El valor debe ser un número positivo" }),
  valortotal: z.number().min(0, { message: "El valor debe ser un número positivo" }) // Asegúrate de validar este campo
});
