// File: src/lib/PDFSignatureProcessor.ts
import { PDFDocument, rgb } from 'pdf-lib';

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
}

export class PDFSignatureProcessor {
  private pdfDoc: PDFDocument | null = null;
  private originalPdfBytes: Uint8Array | null = null;

  async loadPDF(file: File): Promise<void> {
    this.originalPdfBytes = new Uint8Array(await file.arrayBuffer());
    this.pdfDoc = await PDFDocument.load(this.originalPdfBytes);
  }

  async addSignature(
    signatureDataUrl: string, 
    position: SignaturePosition
  ): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('PDF not loaded');

    // Get the page where signature should be placed
    const page = this.pdfDoc.getPage(position.pageIndex);
    
    // Convert signature image to PDF-compatible format
    let signatureImage;
    if (signatureDataUrl.startsWith('data:image/png')) {
      const signatureBytes = this.dataUrlToBytes(signatureDataUrl);
      signatureImage = await this.pdfDoc.embedPng(signatureBytes);
    } else if (signatureDataUrl.startsWith('data:image/jpeg')) {
      const signatureBytes = this.dataUrlToBytes(signatureDataUrl);
      signatureImage = await this.pdfDoc.embedJpg(signatureBytes);
    } else {
      throw new Error('Unsupported signature format');
    }

    // Add signature to page
    page.drawImage(signatureImage, {
      x: position.x,
      y: position.y,
      width: position.width,
      height: position.height,
    });

    // Return modified PDF as bytes
    return await this.pdfDoc.save();
  }

  async addTextSignature(
    text: string,
    position: SignaturePosition,
    fontSize: number = 12
  ): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('PDF not loaded');

    const page = this.pdfDoc.getPage(position.pageIndex);
    
    page.drawText(text, {
      x: position.x,
      y: position.y,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    return await this.pdfDoc.save();
  }

  private dataUrlToBytes(dataUrl: string): Uint8Array {
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
