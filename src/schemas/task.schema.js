import { z } from 'zod'

export const creatTaskSchema = z.object({

    apellido: z.string({
        required_error: 'Apellido is required'
    }),
    nombre: z.string({
        required_error: 'Nombre is required'
    }),
    dni: z.string({
        required_error: 'DNI is required'
    }),
    fechanacimiento: z.string({
        required_error: 'Fecha de nacimiento es requerida'
    }),
    genero: z.string({
        required_error: 'Género is required'
    }),
    nacimiento: z.string({
        required_error: 'Lugar de Nacimiento is required'
    }),

    municipio: z.string({
        required_error: 'Municipio is required'
    }),

    postal: z.string({
        required_error: 'Dirección Postal is required'
    }),

    direccion: z.string({
        required_error: 'Dirección is required'
    }),

    residencia: z.string({
        required_error: 'Residencia es requerida'
    }),

    nacionalidad: z.string({
        required_error: 'Nacionalidad is required'
    }),
    correo: z.string({
        required_error: 'Correo is required'
    }),

    telefono: z.string({
        required_error: 'Teléfono is required'
    }),

    roldirecto: z.array(z.string()),

    disciplinadirecta: z.array(z.string()),

    rolindirecto: z.array(z.string()),

    disciplinaindirecta: z.array(z.string()),

    publico: z.string(),

    formacionpublica: z.array(z.string()),

    disciplinapublica: z.array(z.string()),

    privada: z.string(),

    formacionprivada: z.array(z.string()),

    disciplinaprivada: z.array(z.string()),


    

    observaciones: z.string({
        required_error: 'Observaciones is required'
    }),



})