import SignPDF from "../utils/pdf/signPdf";
import SignedPdf from "../models/SignedPdf";
import { getPagination } from "../utils/getPagination";

export const signatureAndSavePdf = async (req, res) => {
    try {
        let pdf;
        let nameFile;
        let certificate;
        req.files.map(file => {
            if (file.mimetype === "application/pdf") {
                pdf = file.buffer;
                nameFile = file.originalname;
            } else if (file.mimetype === "application/x-pkcs12") {
                certificate = file.buffer;
            }
        })  

        if (pdf == undefined || certificate == undefined) return res.json({success: false, message: "You must enter a pdf file and a certificate file"})
        const pdfBuffer = new SignPDF(pdf, certificate);
        
        const signedDocs = await pdfBuffer.signPDF();
        const randomNumber = Math.floor(Math.random() * 5000);
        const pdfName = `./exports/exported_file_${randomNumber}.pdf`;

        const signedPdf = new SignedPdf({
            name:nameFile,
            pdf: signedDocs
        })

        await signedPdf.save();
        
        fs.writeFileSync(pdfName, signedDocs);

        setTimeout(() => {
            fs.unlinkSync(pdfName);
        }, 3000);
        res.download(pdfName);
    } catch (error) {
        res.status(500).json({err: error});
    }
}

export const getAllSignedPdfs = async (req, res) => {
    try {

        const { size, page, name  } = req.query;

        const condition = name ?   
        {
            name: {$regex: new RegExp(name), $options: "i"}
        } 
            : 
        {}
    
        const {limit, offset } = getPagination(size, page);
        const data = await SignedPdf.paginate(condition, {limit, offset});
        console.log(data.docs[0])

        const names = data.docs.map( item => {
            return {
                name: item.name,
                createdAt: item.createdAt,
            }
        });

        res.json({
            totalItems: data.totalDocs,
            systems: names,
            totalPages: data.totalPages,
            currentPage: data.page - 1
        });
    } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message || "Error trying to get all signed pdf"
      })
    }
  };

