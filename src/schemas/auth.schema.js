import {z} from 'zod'

export const registerSchema = z.object({
    username: z.string({
        required_error: 'Username es requerido'
    }), 
    email: z
    .string({
      required_error: "Email es requerido",
    })
    .email({
      message: "Email is not valid",
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6,{
        message: 'Password mus be at least 6 characters'
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
        required_error: 'Usuario is required'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6,{
        message: 'Password mus be at least 6 characters'
    })
})