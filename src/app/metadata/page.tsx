"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

  const updateMetadataField = (category: string, field: string, value: any) => {
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

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const basicMetadata: ImageMetadata = {
      fileName: file.name,
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

  const renderEditableField = (category: string, field: string, value: any, label: string) => {
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
            className="bg-gray-800 border-gray-700"
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
        <motion.div variants={fadeIn}>
          <Card className="p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800">
            <motion.h2 variants={slideIn} className="text-2xl font-semibold mb-6">Image Metadata Viewer</motion.h2>
            
            <div className="space-y-6">
              <motion.div variants={fadeIn} className="flex items-center gap-4">
                <Button
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select Image
                </Button>
                {metadata && (
                  <>
                    <motion.div variants={scaleIn}>
                      <Button
                        onClick={clearPrivacyData}
                        variant="secondary"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
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
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Image
                      </Button>
                    </motion.div>
                    <motion.div variants={scaleIn}>
                      <Button
                        onClick={clearMetadata}
                        variant="destructive"
                      >
                        Clear
                      </Button>
                    </motion.div>
                  </>
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </motion.div>

              <AnimatePresence>
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
                      <Card className="p-4 bg-blue-900/30 border-blue-700">
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
                        <button
                          onClick={() => toggleSection('basic')}
                          className="w-full p-4 text-left bg-gray-800/50 hover:bg-gray-800/70 flex justify-between items-center"
                        >
                          <h3 className="text-xl font-semibold">Basic Information</h3>
                          <span>{expandedSections['basic'] ? '−' : '+'}</span>
                        </button>
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
                          <button
                            onClick={() => toggleSection('exif')}
                            className="w-full p-4 text-left bg-gray-800/50 hover:bg-gray-800/70 flex justify-between items-center"
                          >
                            <h3 className="text-xl font-semibold">EXIF Information</h3>
                            <span>{expandedSections['exif'] ? '−' : '+'}</span>
                          </button>
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
                          <button
                            onClick={() => toggleSection('gps')}
                            className="w-full p-4 text-left bg-gray-800/50 hover:bg-gray-800/70 flex justify-between items-center"
                          >
                            <h3 className="text-xl font-semibold">GPS Information</h3>
                            <span>{expandedSections['gps'] ? '−' : '+'}</span>
                          </button>
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
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}