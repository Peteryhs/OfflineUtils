"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone, FileWithPath } from 'react-dropzone'; // Added FileWithPath
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '../components/Header';
import { getExifData, ExtendedImageMetadata } from '../utils/exif';
import { estimateLocation } from '../utils/location';
import { fadeIn, slideIn, expandSection, scaleIn, staggerChildren } from '@/lib/animations';
import { saveImageWithMetadata } from '../utils/saveImage';

interface ImageMetadata {
  fileName: string;
  size: number;
  type: string;
  lastModified: string;
  dimensions?: {
    width: number;
    height: number;
  };
  exif?: ExtendedImageMetadata;
}

export default function MetadataViewer() {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({});

  // Logic from original handleFileSelect, now as a separate function
  const processFile = useCallback(async (file: FileWithPath) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url); // Use the new url from the dropped file

    const basicMetadata: ImageMetadata = {
      fileName: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    };

    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve) => { // Ensure Promise is typed
      img.onload = () => {
        basicMetadata.dimensions = {
          width: img.width,
          height: img.height,
        };
        resolve(); // Resolve promise
      };
      img.onerror = () => { // Handle potential error in image loading
        console.error("Error loading image for metadata");
        resolve(); // Still resolve to not block indefinitely
      }
    });

    const exifData = await getExifData(file);
    if (exifData) {
      basicMetadata.exif = exifData;
    }

    setMetadata(basicMetadata);
  }, []); // Removed setImageUrl from dependencies as it's part of the same state update cycle

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Standard way to define accept for images
    maxFiles: 1,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleEditMode = (field: string) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const updateMetadataField = (category: string, field: string, value: string | number | undefined) => {
    setMetadata(prev => {
      if (!prev) return prev;
      if (category === 'exif' && prev.exif) {
        return {
          ...prev,
          exif: {
            ...prev.exif,
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const clearPrivacyData = () => {
    setMetadata(prev => {
      if (!prev) return prev;
      const newMetadata = { ...prev };
      if (newMetadata.exif) {
        // Remove location data
        delete newMetadata.exif.latitude;
        delete newMetadata.exif.longitude;
        delete newMetadata.exif.altitude;
        // Remove device information
        delete newMetadata.exif.make;
        delete newMetadata.exif.model;
        delete newMetadata.exif.software;
        // Remove timestamp
        delete newMetadata.exif.dateTimeOriginal;
      }
      return newMetadata;
    });
  };

  // This is the old handleFileSelect, triggered by the hidden input.
  // It's kept if "Select Another Image" button is used, but dropzone is primary.
  // For this refactor, we'll remove it to rely on the dropzone's own input.
  // const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   await processFile(file as FileWithPath);
  // }, [processFile]);

  const clearMetadata = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setMetadata(null);
    setExpandedSections({});
    setEditMode({});
  }, [imageUrl]);

  const renderEditableField = (category: string, field: string, value: string | number | undefined, label: string) => {
    const isEditing = editMode[`${category}.${field}`];
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label> {/* Changed p to label and updated style */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode(`${category}.${field}`)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
        {isEditing ? (
          <Input
            value={value || ''}
            onChange={(e) => updateMetadataField(category, field, e.target.value)}
          />
        ) : (
          <p>{value}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <motion.div
        className="max-w-4xl mx-auto pt-16"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.h1 variants={slideIn} className="text-3xl font-bold text-center mb-4 text-gray-100">Image Metadata Tools</motion.h1>
        <p className="text-lg text-gray-400 text-center mb-8">View and edit image metadata, including EXIF, GPS, and more.</p>
        <motion.div
          variants={fadeIn}
          className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 space-y-6"
        >
            {!metadata ? (
              <div {...getRootProps()} className={`
                p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer
                transition-all duration-300 ease-out
                ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}
              `}>
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-800 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-gray-400">
                    <p className="font-medium">Drop your image here, or click to select</p>
                    <p className="text-sm">Supports JPG, PNG, WebP, etc.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <motion.div variants={fadeIn} className="flex items-center gap-4">
                  {/* Removed "Select Another Image" button and its hidden input to simplify */}
                  <motion.div variants={scaleIn}>
                    <Button
                      onClick={clearPrivacyData}
                      variant="secondary"
                    >
                      Clear Privacy Data
                    </Button>
                  </motion.div>
                  <motion.div variants={scaleIn}>
                    <Button
                      onClick={async () => {
                        if (imageUrl && metadata?.exif) {
                          try {
                            const modifiedImage = await saveImageWithMetadata(imageUrl, metadata.exif);
                            const downloadUrl = URL.createObjectURL(modifiedImage);
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = metadata.fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(downloadUrl);
                          } catch (error) {
                            console.error('Error saving image:', error);
                          }
                        }
                      }}
                      variant="secondary"
                    >
                      Save Image
                    </Button>
                  </motion.div>
                  <motion.div variants={scaleIn}>
                    <Button
                      onClick={clearMetadata} // This will clear and show dropzone
                      variant="destructive"
                    >
                      Clear & Upload New
                    </Button>
                  </motion.div>
                </motion.div>

                {imageUrl && (
                  <motion.div
                    variants={scaleIn}
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    };

    const img = new Image();
    img.src = url;
    await new Promise((resolve) => {
      img.onload = () => {
        basicMetadata.dimensions = {
          width: img.width,
          height: img.height,
        };
        resolve(null);
      };
    });

    const exifData = await getExifData(file);
    if (exifData) {
      basicMetadata.exif = exifData;
    }

    setMetadata(basicMetadata);
  }, []);

  const clearMetadata = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setMetadata(null);
    setExpandedSections({});
    setEditMode({});
  }, [imageUrl]);

  const renderEditableField = (category: string, field: string, value: string | number | undefined, label: string) => {
    const isEditing = editMode[`${category}.${field}`];
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-gray-400">{label}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleEditMode(`${category}.${field}`)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
        {isEditing ? (
          <Input
            value={value || ''}
            onChange={(e) => updateMetadataField(category, field, e.target.value)}
          />
        ) : (
          <p>{value}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <motion.div 
        className="max-w-4xl mx-auto pt-16"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.h1 variants={slideIn} className="text-3xl font-bold mb-4 text-center">Image Metadata Tools</motion.h1>
        <motion.div
          variants={fadeIn}
          className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 space-y-6"
        >
            {!metadata ? (
              <div {...getRootProps()} className={`
                p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer
                transition-all duration-300 ease-out
                ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}
              `}>
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-800 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-gray-400">
                    <p className="font-medium">Drop your image here, or click to select</p>
                    <p className="text-sm">Supports JPG, PNG, WebP, etc.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <motion.div variants={fadeIn} className="flex items-center gap-4">
                  {/* Removed "Select Another Image" button and its hidden input to simplify */}
                  <motion.div variants={scaleIn}>
                    <Button
                      onClick={clearPrivacyData}
                      variant="secondary"
                    >
                      Clear Privacy Data
                    </Button>
                  </motion.div>
                  <motion.div variants={scaleIn}>
                    <Button
                      onClick={async () => {
                        if (imageUrl && metadata?.exif) {
                          try {
                            const modifiedImage = await saveImageWithMetadata(imageUrl, metadata.exif);
                            const downloadUrl = URL.createObjectURL(modifiedImage);
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = metadata.fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(downloadUrl);
                          } catch (error) {
                            console.error('Error saving image:', error);
                          }
                        }
                      }}
                      variant="secondary"
                    >
                      Save Image
                    </Button>
                  </motion.div>
                  <motion.div variants={scaleIn}>
                    <Button
                      onClick={clearMetadata}
                      variant="destructive"
                    >
                      Clear All & Re-upload
                    </Button>
                  </motion.div>
                </motion.div>

                {imageUrl && (
                  <motion.div 
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="relative w-full h-64 rounded-lg overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt="Selected image"
                      className="object-contain w-full h-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {metadata && (
                  <motion.div 
                    variants={staggerChildren}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <motion.div variants={scaleIn}>
                      <div className="p-4 bg-blue-900/30 border-blue-700 rounded-xl">
                        <div className="grid grid-cols-2 gap-4">
                          {renderEditableField('basic', 'fileName', metadata.fileName, 'File Name')}
                          <div className="space-y-2">
                            <p className="text-blue-300 font-medium">Last Modified</p>
                            <p className="text-lg">{metadata.lastModified}</p>
                          </div>
                          {metadata.exif?.latitude && metadata.exif?.longitude && (
                            <div className="space-y-2">
                              <p className="text-blue-300 font-medium">Location</p>
                              <p className="text-lg">{estimateLocation(metadata.exif.latitude, metadata.exif.longitude)}</p>
                              <p className="text-sm text-gray-400">{metadata.exif.latitude.toFixed(6)}, {metadata.exif.longitude.toFixed(6)}</p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <p className="text-blue-300 font-medium">Size</p>
                            <p className="text-lg">{(metadata.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>

                    <motion.div variants={staggerChildren} className="space-y-4">
                      {/* Basic Information Section */}
                      <motion.div variants={fadeIn} className="border border-gray-800 rounded-lg overflow-hidden">
                        <Button
                          onClick={() => toggleSection('basic')}
                          variant="subtle"
                          className="w-full justify-between p-4 text-left"
                        >
                          <h3 className="text-xl font-semibold">Basic Information</h3>
                          <span>{expandedSections['basic'] ? '−' : '+'}</span>
                        </Button>
                        <AnimatePresence>
                          {expandedSections['basic'] && (
                            <motion.div 
                              variants={expandSection}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="p-4 space-y-4"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                {renderEditableField('basic', 'type', metadata.type, 'File Type')}
                                {metadata.dimensions && (
                                  <div className="space-y-2">
                                    <p className="text-gray-400">Dimensions</p>
                                    <p>{metadata.dimensions.width} × {metadata.dimensions.height} pixels</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* EXIF Information Section */}
                      {metadata.exif && (
                        <motion.div variants={fadeIn} className="border border-gray-800 rounded-lg overflow-hidden">
                          <Button
                            onClick={() => toggleSection('exif')}
                            variant="subtle"
                            className="w-full justify-between p-4 text-left"
                          >
                            <h3 className="text-xl font-semibold">EXIF Information</h3>
                            <span>{expandedSections['exif'] ? '−' : '+'}</span>
                          </Button>
                          <AnimatePresence>
                            {expandedSections['exif'] && (
                              <motion.div 
                                variants={expandSection}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="p-4 space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  {metadata.exif.make && renderEditableField('exif', 'make', metadata.exif.make, 'Camera Make')}
                                  {metadata.exif.model && renderEditableField('exif', 'model', metadata.exif.model, 'Camera Model')}
                                  {metadata.exif.exposureTime && renderEditableField('exif', 'exposureTime', metadata.exif.exposureTime, 'Exposure Time')}
                                  {metadata.exif.fNumber && renderEditableField('exif', 'fNumber', metadata.exif.fNumber, 'F-Number')}
                                  {metadata.exif.iso && renderEditableField('exif', 'iso', metadata.exif.iso, 'ISO')}
                                  {metadata.exif.focalLength && renderEditableField('exif', 'focalLength', metadata.exif.focalLength, 'Focal Length')}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}

                      {/* GPS Information Section */}
                      {metadata.exif?.latitude && metadata.exif?.longitude && (
                        <motion.div variants={fadeIn} className="border border-gray-800 rounded-lg overflow-hidden">
                          <Button
                            onClick={() => toggleSection('gps')}
                            variant="subtle"
                            className="w-full justify-between p-4 text-left"
                          >
                            <h3 className="text-xl font-semibold">GPS Information</h3>
                            <span>{expandedSections['gps'] ? '−' : '+'}</span>
                          </Button>
                          <AnimatePresence>
                            {expandedSections['gps'] && (
                              <motion.div 
                                variants={expandSection}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="p-4 space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  {renderEditableField('exif', 'latitude', metadata.exif.latitude.toFixed(6), 'Latitude')}
                                  {renderEditableField('exif', 'longitude', metadata.exif.longitude.toFixed(6), 'Longitude')}
                                  {metadata.exif.altitude && renderEditableField('exif', 'altitude', metadata.exif.altitude.toFixed(1), 'Altitude')}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

        </motion.div>
      </motion.div>
    </div>
  );
}