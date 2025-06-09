import { PDFDocument } from 'pdf-lib';

export async function convertToImage(file: File, format: 'jpg' | 'png' | 'webp', quality: number = 90) {
  if (file.type === 'application/pdf') {
    // Convert PDF to image using canvas
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // Draw PDF page on canvas (simplified version - may need pdf.js for better rendering)
    // For now, we'll return null as PDF to image conversion needs more complex implementation
    return null;
  } else {
    // Convert between image formats using canvas
    const blob = new Blob([file]);
    const imageBitmap = await createImageBitmap(blob);
    
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageBitmap, 0, 0);
    
    return await new Promise<ArrayBuffer>((resolve) => {
      canvas.toBlob(
        (blob) => {
          blob!.arrayBuffer().then(resolve);
        },
        `image/${format}`,
        quality / 100
      );
    });
  }
}

export async function convertToPDF(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Input file must be an image');
  }

  // Create a canvas to get image dimensions
  const blob = new Blob([file]);
  const imageBitmap = await createImageBitmap(blob);
  const { width, height } = imageBitmap;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width || 595, height || 842]); // Use A4 size if dimensions are unknown

  // Convert image to PNG format using canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0);

  // Get PNG data from canvas
  const pngData = await new Promise<ArrayBuffer>((resolve) => {
    canvas.toBlob(async (blob) => {
      const arrayBuffer = await blob!.arrayBuffer();
      resolve(arrayBuffer);
    }, 'image/png');
  });

  // Embed the PNG in the PDF
  const pngImage = await pdfDoc.embedPng(pngData);
  const { width: imgWidth, height: imgHeight } = pngImage.scale(1);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: imgWidth,
    height: imgHeight,
  });

  // Save the PDF
  return await pdfDoc.save();
}