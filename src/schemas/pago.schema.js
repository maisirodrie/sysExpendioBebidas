import { z } from "zod";

export const updatePagoSchema = z.object({
  value: z.number().min(0, { message: "El valor debe ser un número positivo" }),
});