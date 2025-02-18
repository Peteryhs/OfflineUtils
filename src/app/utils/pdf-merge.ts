import { PDFDocument, PageSizes, degrees } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';

interface MergeOptions {
  quality: number;
  margin: number;
}

// Worker configuration is handled in pdf.worker.ts

async function getMaxPageDimensions(files: File[]): Promise<{ width: number; height: number }> {
  let maxWidth = 0;
  let maxHeight = 0;

  for (const file of files) {
    if (file.type === 'application/pdf') {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      for (const page of pdf.getPages()) {
        maxWidth = Math.max(maxWidth, page.getWidth());
        maxHeight = Math.max(maxHeight, page.getHeight());
      }
    } else if (file.type.startsWith('image/')) {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });
      maxWidth = Math.max(maxWidth, img.width);
      maxHeight = Math.max(maxHeight, img.height);
      URL.revokeObjectURL(img.src);
    }
  }

  return { width: maxWidth || PageSizes.A4[0], height: maxHeight || PageSizes.A4[1] };
}

export async function mergeToPDF(files: File[], options: MergeOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const { width: targetWidth, height: targetHeight } = await getMaxPageDimensions(files);
  
  for (const file of files) {
    if (file.type === 'application/pdf') {
      const existingPdfBytes = await file.arrayBuffer();
      const existingPdf = await PDFDocument.load(existingPdfBytes);
      const pages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
      pages.forEach(page => {
        const { width, height } = page.getSize();
        const scale = Math.min(targetWidth / width, targetHeight / height);
        page.scale(scale, scale);
        pdfDoc.addPage(page);
      });
    } else if (file.type.startsWith('image/')) {
      const imageBytes = await file.arrayBuffer();
      let image;
      
      if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (file.type === 'image/gif' || file.type === 'image/bmp') {
        // Convert to PNG first using canvas
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = URL.createObjectURL(file);
        });
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const pngData = await fetch(canvas.toDataURL('image/png')).then(res => res.arrayBuffer());
        image = await pdfDoc.embedPng(pngData);
        
        URL.revokeObjectURL(img.src);
      }
      
      if (image) {
        const page = pdfDoc.addPage([targetWidth, targetHeight]);
        const { width, height } = image.scale(1);
        const pageWidth = page.getWidth() - (2 * options.margin);
        const pageHeight = page.getHeight() - (2 * options.margin);
        
        // Calculate scaling to fit within margins while maintaining aspect ratio
        const scale = Math.min(
          pageWidth / width,
          pageHeight / height
        );
        
        // Center the image on the page
        const x = (page.getWidth() - width * scale) / 2;
        const y = (page.getHeight() - height * scale) / 2;
        
        page.drawImage(image, {
          x,
          y,
          width: width * scale,
          height: height * scale
        });
      }
    }
  }
  
  // Apply quality settings
  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  });
}