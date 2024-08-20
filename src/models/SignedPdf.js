import mongoose from "mongoose";

const SignedPdfSchema = new Schema({
    name: String,
    pdf: Buffer,
},
{
    versionKey: false,
    timestamps: true
});

export default mongoose.model("Task", SignedPdfSchema);
