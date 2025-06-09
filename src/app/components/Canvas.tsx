"use client";

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button'; // Added Button import
import { useToast } from '@/components/ui/use-toast'; // Added useToast import
import { RotateCcw, RotateCw, ArrowLeftRight, ArrowUpDown, Download } from 'lucide-react'; // Added Lucide icons

interface CanvasProps {
  width?: number;
  height?: number;
  imageUrl?: string;
}

export default function Canvas({ imageUrl }: CanvasProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isDownloading, setIsDownloading] = useState(false); // Added isDownloading state
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast(); // Initialized useToast

  function onImageLoad() {
    setCrop({
      unit: '%',
      x: 25,
      y: 25,
      width: 50,
      height: 50
    });
  }

  function rotateLeft() {
    setRotation((prev) => (prev - 90) % 360);
  }

  function rotateRight() {
    setRotation((prev) => (prev + 90) % 360);
  }

  function flipHorizontal() {
    setFlipX((prev) => !prev);
  }

  function flipVertical() {
    setFlipY((prev) => !prev);
  }

  async function getCroppedImg() { // Made async for potential promise in toBlob
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      toast({
        title: "Error",
        description: "Cannot process image: Missing crop, image reference, or canvas reference.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const image = imgRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        toast({
          title: "Error",
          description: "Could not get canvas context.",
          variant: "destructive",
        });
        setIsDownloading(false); // Reset before early return
        return;
      }

      // Calculate the actual dimensions based on the original image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    // Set canvas size to match the scaled crop size
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.translate(-canvas.width/2, -canvas.height/2);
  
    // Draw the cropped portion of the image with proper scaling
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  
    ctx.restore();
  
    // Convert to blob and create download link
      // Convert to blob and create download link
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            toast({
              title: "Error",
              description: "Could not create image blob.",
              variant: "destructive",
            });
            reject(new Error("Could not create image blob."));
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cropped-image.png';
          document.body.appendChild(a); // Required for Firefox
          a.click();
          document.body.removeChild(a); // Clean up
          URL.revokeObjectURL(url);
          toast({
            title: "Image Ready",
            description: "Cropped image download started.",
          });
          resolve();
        }, 'image/png', 1.0);
      });
    } catch (e) {
      console.error("Error in getCroppedImg:", e);
      toast({
        title: "Error",
        description: "Could not process image for download.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {imageUrl && (
        <>
          <div className="flex flex-wrap gap-2 mb-4"> {/* Changed to flex-wrap and gap-2 for better responsiveness */}
            <Button variant="outline" onClick={rotateLeft} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> Rotate Left
            </Button>
            <Button variant="outline" onClick={rotateRight} className="flex items-center gap-2">
              <RotateCw className="h-4 w-4" /> Rotate Right
            </Button>
            <Button variant="outline" onClick={flipHorizontal} className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" /> Flip H
            </Button>
            <Button variant="outline" onClick={flipVertical} className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" /> Flip V
            </Button>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50"> {/* Updated classes */}
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
              className="max-w-full" // Ensure ReactCrop itself doesn't cause overflow issues
            >
              <img
                ref={imgRef}
                src={imageUrl}
                style={{
                  maxWidth: '100%', // This should be handled by ReactCrop, but good to have
                  maxHeight: '60vh', // Constrain image height within the crop area
                  objectFit: 'contain', // Ensure aspect ratio is maintained
                  transform: `rotate(${rotation}deg) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`
                }}
                onLoad={onImageLoad}
                alt="Edit me"
                // className="rounded-lg" // Rounding might be better on the parent container
              />
            </ReactCrop>
          </div>
          <div className="flex justify-end mt-4"> {/* Added mt-4 for spacing */}
            <Button
              variant="default"
              onClick={getCroppedImg}
              isLoading={isDownloading}
              className="flex items-center gap-2"
              size="lg" // Made button larger
            >
              <Download className="h-5 w-5" />
              Download Edited Image
            </Button>
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