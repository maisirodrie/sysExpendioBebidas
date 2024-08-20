import express from 'express'
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors'

import authRoutes from "./routes/auth.routes.js"
import tasksRoutes from "./routes/tasks.routes.js";

const app = express()

// app.use(cors({
//     origin: 'https://www.rohtda.misiones.gov.ar',
//     credentials:true
// }))

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '.files')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,uniqueSuffix + file.originalname)
    }
  })
  

  const upload = multer({ storage: storage })

app.post("upload-files", upload.single("file"), async(req,res)=>{
    console.log(req.file)
})


app.use (morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use("/api",authRoutes)
app.use("/api",tasksRoutes)

export default app;
