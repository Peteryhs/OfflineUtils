"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header';
import { convertToImage, convertToPDF } from '../utils/converter';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type ConversionFormat = 'pdf' | 'jpg' | 'png' | 'webp';

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<ConversionFormat>('pdf');
  const [quality, setQuality] = useState<number>(90);
  const [converting, setConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);
    try {
      let result: ArrayBuffer | Uint8Array | null;
      let blobType: string;

      if (targetFormat === 'pdf') {
        result = await convertToPDF(file);
        blobType = 'application/pdf';
      } else {
        result = await convertToImage(file, targetFormat, quality);
        blobType = `image/${targetFormat}`;
      }

      if (!result) {
        throw new Error('Conversion returned null.');
      }

      // Create and trigger download
      const blob = new Blob([result], { type: blobType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${targetFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert file. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <div className="max-w-4xl mx-auto pt-16 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-100">Format Converter</h1>
          <p className="text-lg text-gray-400 text-center mb-8">Convert between PDF and image formats with high quality</p>
        </div>

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
            {file ? (
              <div className="text-gray-300">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <p className="font-medium">Drop your file here, or click to select</p>
                <p className="text-sm">Supports PDF, JPG, PNG, and WebP</p>
              </div>
            )}
          </div>
        </div>

        {file && (
          <div className="space-y-6 bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Convert to:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['pdf', 'jpg', 'png', 'webp'] as ConversionFormat[]).map((format) => (
                  <Button
                    key={format}
                    onClick={() => setTargetFormat(format)}
                    variant={targetFormat === format ? "default" : "subtle"}
                    size="sm"
                    className="uppercase"
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>

            {targetFormat !== 'pdf' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Quality: {quality}%</label>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={(newVal) => setQuality(newVal[0])}
                  className="w-full"
                />
              </div>
            )}

            <Button
              onClick={handleConvert}
              disabled={converting}
              variant="default"
              className="w-full"
            >
              {converting ? 'Converting...' : 'Convert'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}