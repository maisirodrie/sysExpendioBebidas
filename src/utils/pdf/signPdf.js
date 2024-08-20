     
import { PDFDocument, PDFName, PDFNumber, PDFHexString, PDFString, rgb } from "pdf-lib";
import signer from "node-signpdf";
import PDFArrayCustom from "./pdfArrayCustom";
  
export default class SignPDF {
  constructor(pdfFile, certFile) {
    this.pdfDoc = pdfFile;
    this.certificate = certFile;
  }
     
  async signPDF() {
    let newPDF = await this._addPlaceholder();
    newPDF = signer.sign(newPDF, this.certificate);
  
    return newPDF;
  }
  
  async _addPlaceholder() {
    console.log(this.certificate)
    const loadedPdf = await PDFDocument.load(this.pdfDoc);
    const ByteRange = PDFArrayCustom.withContext(loadedPdf.context);
    const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';
    const SIGNATURE_LENGTH = 5000;
    const pages = loadedPdf.getPages();
  
    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(DEFAULT_BYTE_RANGE_PLACEHOLDER));
  
    const signatureDict = loadedPdf.context.obj({
      Type: 'Sig',
      Filter: 'Adobe.PPKLite',
      SubFilter: 'adbe.pkcs7.detached',
      ByteRange,
      Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
      Reason: PDFString.of('We need your signature for reasons...'),
      M: PDFString.fromDate(new Date()),
    });
  
    const signatureDictRef = loadedPdf.context.register(signatureDict);
  
    const widgetDict = loadedPdf.context.obj({
      Type: 'Annot',
      Subtype: 'Widget',
      FT: 'Sig',
      Rect: [0, 0, 0, 0], // Signature rect size
      V: signatureDictRef,
      T: PDFString.of('test signature'),
      F: 4,
      P: pages[0].ref,
    });
  
    const widgetDictRef = loadedPdf.context.register(widgetDict);
  
    const { width, height } = pages[0].getSize();

    // Draw a string of text toward the top of the page
    const fontSize = 10
    pages[0].drawText('DIRECCIÓN', {
      x: width - 110,
      y: height - 6,
      size: fontSize,
      color: rgb(0, 0, 0),
    })
    pages[0].drawText('BOLETIN', {
      x: width - 110,
      y: height - 17,
      size: fontSize,
      color: rgb(0, 0, 0),
    })
    pages[0].drawText('OFICIAL', {
      x: width - 110,
      y: height - 27,
      size: fontSize,
      color: rgb(0, 0, 0),
    })

    // Add signature widget to the first page
    pages[0].node.set(PDFName.of('Annots'), loadedPdf.context.obj([widgetDictRef]));
  
    loadedPdf.catalog.set(
      PDFName.of('AcroForm'),
      loadedPdf.context.obj({
        SigFlags: 3,
        Fields: [widgetDictRef],
      })
    );
  
    const pdfBytes = await loadedPdf.save({ useObjectStreams: false });
  
    return SignPDF.unit8ToBuffer(pdfBytes);
  }
  
  static unit8ToBuffer(unit8) {
    let buf = Buffer.alloc(unit8.byteLength);
    const view = new Uint8Array(unit8);
  
    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
    }
    return buf;
  }
}
  