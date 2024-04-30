import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({

    apellido: {
        type: String,
        require: true,
        trim: true,
    },
    nombre :{
        type: String,
        require: true,
        trim: true,
    },
    dni: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    
    fechanacimiento: {
        type: Date,
        required: true,
        unique: true,
        trim: true,

    },
     
    genero :{
        type: String,
        require: true,
        trim: true,
    },

    nacimiento :{
        type: String,
        require: true,
        trim: true,
    },

    municipio: {
        type: String,
        required: true,
        trim: true
    },

    postal :{
        type: String,
        require: true,
        trim: true,
    },

    direccion :{
        type: String,
        require: true,
        trim: true,
    },

    residencia :{
        type: String,
        require: true,
        trim: true,
    },
    
    nacionalidad :{
        type: String,
        require: true,
        trim: true,
    },  

    correo :{
        type: String,
        require: true,
        trim: true,
    },    
    telefono :{
        type: String,
        require: true,
        trim: true,
    }, 

    roldirecto: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    },
    disciplinadirecta: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    }, 
    rolindirecto: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    },
    disciplinaindirecta: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    }, 
    publico: {
        type: String,
        trim: true,
    }, 
    formacionpublica: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    }, 
    disciplinapublica: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    }, 
    privada: {
        type: String,
        trim: true,
    }, 
    formacionprivada: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    }, 
    disciplinaprivada: {
        type: [String], // Ahora es un arreglo de strings
        trim: true,
    },
  
    

    observaciones :{
        type: String,
        require: true,
        trim: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }

},
    {
        timestamps: true,
    
})

export default mongoose.model ('Task' , tasksSchema)