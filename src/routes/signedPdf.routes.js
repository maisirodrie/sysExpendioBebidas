import { Router } from 'express';
const signatureRouter = Router();
import * as signatureController from "../controllers/signedPdf.controller";

//Schema Definition
/**
 * @swagger
 * components:
 *  schemas:
 *     SignedPdf:
 *          type: object
 *          properties:
 *              name: 
 *                  type: string
 *                  description: Nombre del archivo pdf - se obtiene del mismo archivo no es necesarío ingresarlo
 *              pdf:
 *                  type: Buffer
 *                  description: El archivo pdf firmado
 *          required:
 *              - pdf
 *          example:
 *              name: boletin.pdf
 *              pdf: Buffer del archivo
 *
*/

const signatureFile  = (upload) => {
    //
    /**
     * @swagger
     *  /api/psd-signature:
     *      post:
     *          summary: Firma y guarda el documento pdf en la base de datos - se debe proveer token valido
     *          tags: [SignedPdf] 
     *          requestBody:
     *              required: true
     *              content:
     *                  multipart/form-data:
     *                      schema:
     *                          type: object
     *                          $ref: '#/components/schemas/SignedPdf'
     *          responses: 
     *              200: 
     *                  description: El pdf fue firmado y guardado éxito
     * 
     */
    signatureRouter.post("/", upload.array('files'), signatureController.signatureAndSavePdf);
    return signatureRouter;
}

/**
 * @swagger
 *  /api/pdf-signature:
 *      get:
 *          summary: Devuelve una lista con los nombre de los pdfs firmados y la fecha en que se guardaron
 *          tags: [SignedPdf]  
 *          responses: 
 *              200: 
 *                  description: Nombre de los pdfs firmados y  guardados
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/SignedPdf'
 * 
 */
signatureRouter.get("/", signatureController.getAllSignedPdfs);

export default signatureFile;