"use client";

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CanvasProps {
  width?: number;
  height?: number;
  imageUrl?: string;
}

export default function Canvas({ width = 800, height = 600, imageUrl }: CanvasProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onImageLoad() {
    const { width, height } = imgRef.current!;
    setCrop({
      unit: '%',
      x: 25,
      y: 25,
      width: 50,
      height: 50
    });
  }

  function getCroppedImg() {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match the cropped image size
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // Create a new canvas to strip metadata
    const cleanCanvas = document.createElement('canvas');
    cleanCanvas.width = completedCrop.width;
    cleanCanvas.height = completedCrop.height;
    const cleanCtx = cleanCanvas.getContext('2d');
    
    if (!cleanCtx) return;
    
    // Draw the image onto the new canvas to strip metadata
    cleanCtx.drawImage(canvas, 0, 0);
    
    // Convert to blob with metadata stripped and create download link
    cleanCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-image.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0); // Use maximum quality to preserve image quality
  }

  return (
    <div className="space-y-6">
      {imageUrl && (
        <>
          <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                style={{ maxWidth: '100%', height: 'auto' }}
                onLoad={onImageLoad}
                alt="Crop me"
                className="rounded-lg"
              />
            </ReactCrop>
          </div>
          <div className="flex justify-end">
            <button
              onClick={getCroppedImg}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/20 font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Cropped Image
            </button>
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
}