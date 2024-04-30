import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    password :{
        type: String,
        require: true,
        trim: true,
    },
    email :{
        type: String,
        require: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // Definir roles permitidos
        default: 'user' // Asignar 'user' como rol por defecto
    }
},
    {
        timestamps: true,
    
})

export default mongoose.model ('User' , userSchema)