import {z} from 'zod'

export const creatTaskSchema = z.object({

    apellido:z.string({
        required_error: 'Apellido is required'
    }),
    nombre:z.string({
        required_error: 'Nombre is required'
    }),
    dni:z.string({
        required_error: 'DNI is required'
    }),    
    fechanacimiento: z.string({
        required_error: 'Fecha de nacimiento es requerida'
    }),
    genero:z.string({
        required_error: 'Género is required'
    }),
    nacimiento:z.string({
        required_error: 'Lugar de Nacimiento is required'
    }),

    municipio:z.string({
        required_error: 'Municipio is required'
    }),

    postal:z.string({
        required_error: 'Dirección Postal is required'
    }),

    residencia: z.string({
        required_error: 'Residencia es requerida'
    }),
 
    nacionalidad:z.string({
        required_error: 'Nacionalidad is required'
    }),
    correo:z.string({
        required_error: 'Correo is required'
    }),

    telefono:z.string({
        required_error: 'Teléfono is required'
    }),

    roldirecto: z.array(z.string()).nonempty({
        message: 'Rol directo is required and must be a non-empty array of strings',
    }),

    disciplinadirecta: z.array(z.string()).nonempty({
        message: 'Disciplina del rol directo is required and must be a non-empty array of strings',
    }),

    rolindirecto: z.array(z.string()).nonempty({
        message: 'Rol directo is required and must be a non-empty array of strings',
    }),

    disciplinaindirecta: z.array(z.string()).nonempty({
        message: 'Disciplina del rol indirecto is required and must be a non-empty array of strings',
    }),

    publico:z.string({
        required_error: 'Público is required'
    }),

    formacionpublica: z.array(z.string()).nonempty({
        message: 'Disciplina del rol indirecto is required and must be a non-empty array of strings',
    }),

    disciplinapublica: z.array(z.string()).nonempty({
        message: 'Disciplina del rol indirecto is required and must be a non-empty array of strings',
    }),

    privada:z.string({
        required_error: 'Privada is required'
    }),

    formacionprivada: z.array(z.string()).nonempty({
        message: 'Disciplina del rol indirecto is required and must be a non-empty array of strings',
    }),

    disciplinaprivada: z.array(z.string()).nonempty({
        message: 'Disciplina del rol indirecto is required and must be a non-empty array of strings',
    }),
    

    direccion:z.string({
        required_error: 'Dirección is required'
    }),
    
    observaciones:z.string({
        required_error: 'Observaciones is required'
    }),



})