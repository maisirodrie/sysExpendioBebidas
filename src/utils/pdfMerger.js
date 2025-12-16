// src/utils/pdfMerger.js
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

/**
 * Convierte una imagen (PNG, JPG) a un buffer de PDF
 * @param {Buffer} imageBuffer - Buffer de la imagen
 * @param {string} mimetype - Tipo MIME de la imagen
 * @returns {Promise<Buffer>} Buffer del PDF generado
 */
export async function imageToPDF(imageBuffer, mimetype) {
    try {
        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();
        
        let image;
        
        // Embed la imagen según su tipo
        if (mimetype === 'image/png') {
            image = await pdfDoc.embedPng(imageBuffer);
        } else if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
            image = await pdfDoc.embedJpg(imageBuffer);
        } else {
            throw new Error(`Tipo de imagen no soportado: ${mimetype}`);
        }
        
        // Obtener dimensiones de la imagen
        const { width, height } = image;
        
        // Crear una página con las dimensiones de la imagen
        const page = pdfDoc.addPage([width, height]);
        
        // Dibujar la imagen en la página
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
        
        // Guardar el PDF como buffer
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
        
    } catch (error) {
        console.error('Error convirtiendo imagen a PDF:', error);
        throw error;
    }
}

/**
 * Fusiona dos buffers de PDF en uno solo
 * @param {Buffer} existingPDFBuffer - Buffer del PDF existente
 * @param {Buffer} newPDFBuffer - Buffer del nuevo PDF a agregar
 * @returns {Promise<Buffer>} Buffer del PDF combinado
 */
export async function mergePDFBuffers(existingPDFBuffer, newPDFBuffer) {
    try {
        // Cargar ambos PDFs
        const existingPDF = await PDFDocument.load(existingPDFBuffer);
        const newPDF = await PDFDocument.load(newPDFBuffer);
        
        // Crear un nuevo documento para el merge
        const mergedPDF = await PDFDocument.create();
        
        // Copiar páginas del PDF existente
        const existingPages = await mergedPDF.copyPages(
            existingPDF,
            existingPDF.getPageIndices()
        );
        existingPages.forEach((page) => mergedPDF.addPage(page));
        
        // Copiar páginas del nuevo PDF
        const newPages = await mergedPDF.copyPages(
            newPDF,
            newPDF.getPageIndices()
        );
        newPages.forEach((page) => mergedPDF.addPage(page));
        
        // Guardar el PDF combinado
        const mergedPDFBytes = await mergedPDF.save();
        return Buffer.from(mergedPDFBytes);
        
    } catch (error) {
        console.error('Error fusionando PDFs:', error);
        throw error;
    }
}

/**
 * Procesa y fusiona un archivo existente con uno nuevo
 * Convierte imágenes a PDF si es necesario y combina
 * @param {Object} existingFile - Archivo existente {buffer, mimetype}
 * @param {Object} newFile - Nuevo archivo {buffer, mimetype}
 * @returns {Promise<Buffer>} Buffer del archivo fusionado
 */
export async function processFileMerge(existingFile, newFile) {
    try {
        let existingPDFBuffer;
        let newPDFBuffer;
        
        // Convertir archivo existente a PDF si es imagen
        if (existingFile.mimetype.startsWith('image/')) {
            console.log('  → Convirtiendo imagen existente a PDF...');
            existingPDFBuffer = await imageToPDF(existingFile.buffer, existingFile.mimetype);
        } else if (existingFile.mimetype === 'application/pdf') {
            existingPDFBuffer = existingFile.buffer;
        } else {
            throw new Error(`Tipo de archivo no soportado: ${existingFile.mimetype}`);
        }
        
        // Convertir nuevo archivo a PDF si es imagen
        if (newFile.mimetype.startsWith('image/')) {
            console.log('  → Convirtiendo imagen nueva a PDF...');
            newPDFBuffer = await imageToPDF(newFile.buffer, newFile.mimetype);
        } else if (newFile.mimetype === 'application/pdf') {
            newPDFBuffer = newFile.buffer;
        } else {
            throw new Error(`Tipo de archivo no soportado: ${newFile.mimetype}`);
        }
        
        // Fusionar ambos PDFs
        console.log('  → Fusionando PDFs...');
        const mergedBuffer = await mergePDFBuffers(existingPDFBuffer, newPDFBuffer);
        
        return mergedBuffer;
        
    } catch (error) {
        console.error('Error procesando fusión de archivos:', error);
        throw error;
    }
}
