'use client';

import { useState, useCallback } from 'react';
'use client';

import { useState, useCallback } from 'react';
import { DraggableFile } from '../../components/DraggableFile';
import { useDropzone } from 'react-dropzone';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { mergeToPDF } from '../../utils/pdf-merge';
import Header from '../../components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Added Card imports
import { Button } from '@/components/ui/button'; // Added Button import
import { Slider } from '@/components/ui/slider'; // Added Slider import
import { useToast } from '@/components/ui/use-toast'; // Added useToast import

interface FileWithPreview extends File {
  preview?: string;
}

interface MergeOptions {
  quality: number;
  margin: number;
}

export default function PDFMergePage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [options, setOptions] = useState<MergeOptions>({
    quality: 100,
    margin: 0,
  });
  const [isMerging, setIsMerging] = useState(false); // Added isMerging state
  const { toast } = useToast(); // Initialized useToast

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    }
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview || '');
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleOptionChange = (key: keyof MergeOptions, value: number) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true); // Set isMerging to true
    try {
      const mergedPdfBytes = await mergeToPDF(files, options);
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ // Added success toast
        title: "Merge Successful",
        description: "Files have been merged into merged-document.pdf.",
      });
    } catch (error) {
      console.error('Error merging files:', error);
      toast({ // Replaced alert with error toast
        title: "Merge Failed",
        description: "An error occurred while merging files. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsMerging(false); // Set isMerging to false in finally
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
        <Header />
        <div className="max-w-4xl mx-auto pt-16 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">PDF Merge Tool</h1>
            <p className="text-gray-400">Combine multiple PDFs and images into a single document</p>
          </div>
      
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`
                p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer
                transition-all duration-300 ease-out
                ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}
              `}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-foreground">Drop the files here...</p>
              ) : (
                <p className="text-foreground">Drag and drop files here, or click to select files</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: PDF, PNG, JPG, JPEG, GIF, BMP
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="qualitySlider" className="block text-sm font-medium text-muted-foreground mb-1">
                    Quality ({options.quality}%)
                  </label>
                  <Slider
                    id="qualitySlider"
                    min={1}
                    max={100}
                    step={1}
                    value={[options.quality]}
                    onValueChange={(value) => handleOptionChange('quality', value[0])}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="marginSlider" className="block text-sm font-medium text-muted-foreground mb-1">
                    Margin ({options.margin}px)
                  </label>
                  <Slider
                    id="marginSlider"
                    min={0}
                    max={100}
                    step={1}
                    value={[options.margin]}
                    onValueChange={(value) => handleOptionChange('margin', value[0])}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Files ({files.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                {files.map((file, index) => (
                  <DraggableFile
                    key={file.name + index} // Consider a more robust key if names can repeat
                    id={index}
                    name={file.name}
                    index={index}
                    moveFile={(dragIndex, hoverIndex) => {
                      const newFiles = [...files];
                      const dragFile = newFiles[dragIndex];
                      newFiles.splice(dragIndex, 1);
                      newFiles.splice(hoverIndex, 0, dragFile);
                      setFiles(newFiles);
                    }}
                    onRemove={() => handleRemoveFile(index)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleMerge}
            disabled={files.length === 0 || isMerging}
            isLoading={isMerging}
            className="w-full"
            size="lg"
          >
            Merge Files
          </Button>
        </div>
      </div>
    </DndProvider>
  );
}