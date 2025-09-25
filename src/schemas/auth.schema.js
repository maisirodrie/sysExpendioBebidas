import {z} from 'zod'

export const registerSchema = z.object({
    username: z.string({
        required_error: 'Usuario es requerido'
    }), 
    email: z
    .string({
      required_error: "Email es requerido",
    })
    .email({
      message: "Email no valido",
    }),
    password: z.string({
        required_error: 'Password es requerido'
    }).min(6,{
        message: 'Password tiene que tener 6 caracteres'
    }),
    nombre: z.string({
        required_error: 'Nombre es requerido'
    }), 
    apellido: z.string({
        required_error: 'Apellido es requerido'
    }),
})

export const loginSchema = z.object({
    username: z.string({
        required_error: 'Usuario es requerido'
    }),
    password: z.string({
        required_error: 'Password es requerido'
    }).min(6,{
        message: 'Password tiene que tener 6 caracteres'
    })
})