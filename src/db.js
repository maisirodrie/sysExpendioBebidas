import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        
        await mongoose.connect ('mongodb://138.117.77.148/sysrohtdadb');
        localhost:27017
        console.log("DB is connected");
    } catch (error) {
        console.log(error);
    }

    

};