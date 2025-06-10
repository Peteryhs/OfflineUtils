"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Canvas from '../components/Canvas';
import Header from '../components/Header';

export default function ImageProcessor() {
  const [imageUrl, setImageUrl] = useState<string>('');

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <div className="max-w-4xl mx-auto pt-16 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-100">Image Tools</h1>
          <p className="text-lg text-gray-400 text-center mb-8">Crop, rotate, and edit your images with ease</p>
        </div>

        {!imageUrl && (
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
                <p className="text-sm">Supports JPG, PNG, and WebP</p>
              </div>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="space-y-6 bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800">
            <Canvas width={800} height={600} imageUrl={imageUrl} />
          </div>
        )}
      </div>
    </div>
  );
}