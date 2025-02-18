'use client';

import { useState, useCallback } from 'react';
import { DraggableFile } from '../../components/DraggableFile';
import { useDropzone } from 'react-dropzone';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { mergeToPDF } from '../../utils/pdf-merge';
import Header from '../../components/Header';

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

    try {
      const mergedPdfBytes = await mergeToPDF(files, options);
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error merging files:', error);
      alert('An error occurred while merging the files. Please try again.');
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
            <div className="space-y-6 bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Options</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Quality ({options.quality}%)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={options.quality}
                    onChange={(e) => handleOptionChange('quality', parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Margin ({options.margin}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={options.margin}
                    onChange={(e) => handleOptionChange('margin', parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Files ({files.length})</h2>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {files.map((file, index) => (
                  <DraggableFile
                    key={file.name + index}
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
              </div>
            </div>
          </div>

          <button
            onClick={handleMerge}
            disabled={files.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${files.length === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25'}`}
          >
            Merge Files
          </button>
        </div>
      </div>
    </DndProvider>
  );
}