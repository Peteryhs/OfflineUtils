import exifr from 'exifr';

export interface ExtendedImageMetadata {
  // Device information
  make?: string;
  model?: string;
  software?: string;

  // Capture settings
  iso?: number;
  fNumber?: number;
  exposureTime?: string;
  focalLength?: number;

  // Location data
  latitude?: number;
  longitude?: number;
  altitude?: number;

  // Timestamp
  dateTimeOriginal?: Date;
}

export async function getExifData(file: File): Promise<ExtendedImageMetadata | null> {
  try {
    const exif = await exifr.parse(file);
    if (!exif) return null;

    return {
      // Device information
      make: exif.Make,
      model: exif.Model,
      software: exif.Software,

      // Capture settings
      iso: exif.ISO,
      fNumber: exif.FNumber,
      exposureTime: exif.ExposureTime ? `1/${1/exif.ExposureTime}` : undefined,
      focalLength: exif.FocalLength,

      // Location data
      latitude: exif.latitude,
      longitude: exif.longitude,
      altitude: exif.altitude,

      // Timestamp
      dateTimeOriginal: exif.DateTimeOriginal,
    };
  } catch (error) {
    console.error('Error parsing EXIF data:', error);
    return null;
  }
}