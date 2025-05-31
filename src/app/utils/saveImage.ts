import piexif from 'piexifjs';
import { ExtendedImageMetadata } from './exif';

// Define custom types for EXIF data structure
type IFDTagValue = string | number | number[] | [number, number] | [number, number][];

interface IFD {
  [tag: number]: IFDTagValue;
}

interface CustomPiexifDict {
  '0th': IFD;
  'Exif': IFD;
  'GPS': IFD;
  thumbnail?: string; // Changed from string | null | undefined to string | undefined
}

export async function saveImageWithMetadata(imageUrl: string, metadata: ExtendedImageMetadata): Promise<Blob> {
  try {
    // Fetch the image data
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    
    // Create EXIF dictionary using the custom interface
    const exifDict: CustomPiexifDict = {
      '0th': {},
      'Exif': {},
      'GPS': {}
    };

    // Add basic EXIF data
    if (metadata.make) exifDict['0th'][piexif.ImageIFD.Make] = metadata.make;
    if (metadata.model) exifDict['0th'][piexif.ImageIFD.Model] = metadata.model;
    if (metadata.software) exifDict['0th'][piexif.ImageIFD.Software] = metadata.software;

    // Add capture settings
    if (metadata.iso) exifDict['Exif'][piexif.ExifIFD.ISOSpeedRatings] = metadata.iso;
    if (metadata.fNumber) exifDict['Exif'][piexif.ExifIFD.FNumber] = [metadata.fNumber * 100, 100];
    if (metadata.exposureTime) {
      const [numerator, denominator] = metadata.exposureTime.split('/').map(Number);
      exifDict['Exif'][piexif.ExifIFD.ExposureTime] = [numerator, denominator];
    }
    if (metadata.focalLength) exifDict['Exif'][piexif.ExifIFD.FocalLength] = [metadata.focalLength * 100, 100];

    // Add GPS data
    if (metadata.latitude && metadata.longitude) {
      const lat = Math.abs(metadata.latitude);
      const lng = Math.abs(metadata.longitude);
      
      exifDict['GPS'][piexif.GPSIFD.GPSLatitudeRef] = metadata.latitude < 0 ? 'S' : 'N';
      exifDict['GPS'][piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
      
      exifDict['GPS'][piexif.GPSIFD.GPSLongitudeRef] = metadata.longitude < 0 ? 'W' : 'E';
      exifDict['GPS'][piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);
      
      if (metadata.altitude) {
        exifDict['GPS'][piexif.GPSIFD.GPSAltitudeRef] = metadata.altitude < 0 ? 1 : 0;
        exifDict['GPS'][piexif.GPSIFD.GPSAltitude] = [Math.abs(metadata.altitude) * 100, 100];
      }
    }

    // Insert EXIF data into image
    const exifBytes = piexif.dump(exifDict);
    const newImageData = piexif.insert(exifBytes, `data:image/jpeg;base64,${base64Image}`);

    // Convert base64 to Blob
    const binaryString = atob(newImageData.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error saving image with metadata:', error);
    throw error;
  }
}