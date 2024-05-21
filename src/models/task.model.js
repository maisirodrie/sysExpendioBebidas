import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({

    //Encuestador

    apellidoenc: {
        type: String,
        require: true,
        trim: true,
    },
    nombreenc :{
        type: String,
        require: true,
        trim: true,
    },
    celularen: {
        type: String,
        required: true,
        trim: true,
    },
    
    correoen: {
        type: Date,
        required: true,
        trim: true,

    },

    //Datos personales de las y los responsables de la unidad productiva

    //Primer responsable 

    nombreresp1: {
        type: String,
        required: true,
        trim: true
    },

    apellidoresp1 :{
        type: String,
        require: true,
        trim: true,
    },

    dniresp1 :{
        type: String,
        require: true,
        trim: true,
    },
    
    cuitresp1 :{
        type: String,
        require: true,
        trim: true,
    },  

    fechanacimientoresp1 :{
        type: String,
        require: true,
        trim: true,
    },    
    celularresp1 :{
        type: String,
        require: true,
        trim: true,
    }, 

    estudiosresp1 :{
        type: String,
        require: true,
        trim: true,
    },

    //Segundo responsable 

    nombreresp2: {
        type: String,
        required: true,
        trim: true
    },

    apellidoresp2 :{
        type: String,
        require: true,
        trim: true,
    },

    dniresp2 :{
        type: String,
        require: true,
        trim: true,
    },
    
    cuitresp2 :{
        type: String,
        require: true,
        trim: true,
    },  

    fechanacimientoresp2 :{
        type: String,
        require: true,
        trim: true,
    },    
    celularresp2 :{
        type: String,
        require: true,
        trim: true,
    }, 

    estudiosresp2 :{
        type: String,
        require: true,
        trim: true,
    },

    // roldirecto: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // },
    // disciplinadirecta: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // }, 
    // rolindirecto: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // },
    // disciplinaindirecta: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // }, 
    // publico: {
    //     type: String,
    //     trim: true,
    // }, 
    // formacionpublica: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // }, 
    // disciplinapublica: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // }, 
    // privada: {
    //     type: String,
    //     trim: true,
    // }, 
    // formacionprivada: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // }, 
    // disciplinaprivada: {
    //     type: [String], // Ahora es un arreglo de strings
    //     trim: true,
    // },
  
    

    observaciones :{
        type: String,
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