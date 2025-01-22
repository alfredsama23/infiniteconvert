import { Upload, Settings as SettingsIcon, Archive, RefreshCw, Plus, CropIcon } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { type FileItem, type ConversionFormat } from '../types';
import { FileItem as FileItemComponent } from './FileItem';
import { Settings } from './Settings';
import { PreviewModal } from './PreviewModal';
import { CropModal } from './CropModal';
import { type Crop } from 'react-image-crop';
import { convertImage, formatFileSize, convertPDFToImage } from '../utils/converter';
import JSZip from 'jszip';

export function Converter() {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const savedFiles = localStorage.getItem('converterFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      // Reconstruct File objects from the saved data
      return parsedFiles.map((file: any) => ({
        ...file,
        file: new File([new Blob()], file.name, { type: file.file.type })
      }));
    }
    return [];
  });

  const [quality, setQuality] = useState(95);
  const [showSettings, setShowSettings] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [selectedPreview, setSelectedPreview] = useState<FileItem | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [selectedForCrop, setSelectedForCrop] = useState<FileItem | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>('jpg');
  const [hasTransparentFiles, setHasTransparentFiles] = useState(false);

  // Save files to localStorage whenever they change
  useEffect(() => {
    const filesToSave = files.map(file => ({
      ...file,
      file: {
        name: file.file.name,
        type: file.file.type
      }
    }));
    localStorage.setItem('converterFiles', JSON.stringify(filesToSave));
  }, [files]);

  // Check if all files are converted
  const allFilesConverted = files.length > 0 && !files.some(f => f.needsConversion);

  // Drag-and-drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file =>
      file.type.startsWith('image/') ||
      file.type === 'application/pdf' ||
      ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/bmp', 'image/gif', 'image/x-icon', 'image/tiff'].includes(file.type)
    );

    const fileItems: FileItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: formatFileSize(file.size),
      status: 'pending',
      progress: 0,
      file,
      needsConversion: true,
      outputFormat,
    }));

    setFiles(prev => [...prev, ...fileItems]);
  }, [outputFormat]);

  const handleFormatChange = (id: string, format: ConversionFormat) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, outputFormat: format, needsConversion: true } : f
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const convertAll = async () => {
    const updatedFiles = [...files];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      const file = updatedFiles[i];
      if (!file.needsConversion) continue;

      try {
        file.status = 'converting';
        setFiles([...updatedFiles]);

        const result = await convertImage(
          file,
          file.outputFormat || 'jpg',
          quality,
          backgroundColor
        );

        file.status = 'done';
        file.resultUrl = result.url;
        file.hasTransparency = result.hasTransparency;
        file.convertedSize = result.convertedSize;
        file.needsConversion = false;
        file.progress = 100;

        setFiles([...updatedFiles]);
      } catch (error) {
        console.error('Conversion failed:', error);
        file.status = 'pending';
        file.progress = 0;
        setFiles([...updatedFiles]);
      }
    }
  };

  const downloadFile = (file: FileItem) => {
    if (file.resultUrl) {
      const link = document.createElement('a');
      link.href = file.resultUrl;
      const extension = file.outputFormat || 'jpg';
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      link.download = `${baseName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    
    files.forEach(file => {
      if (file.resultUrl) {
        const extension = file.outputFormat || 'jpg';
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const fileName = `${baseName}.${extension}`;
        
        zip.file(fileName, fetch(file.resultUrl).then(res => res.blob()));
      }
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'converted_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCrop = async (file: FileItem) => {
    setSelectedForCrop(file);
    setCropMode(true);

    try {
      let imageUrl: string;
      
      if (file.file.type === 'application/pdf') {
        const result = await convertPDFToImage(file.file);
        imageUrl = result.url;
      } else {
        imageUrl = URL.createObjectURL(file.file);
      }
      
      setImgSrc(imageUrl);
    } catch (error) {
      console.error('Error preparing file for crop:', error);
      setCropMode(false);
      setSelectedForCrop(null);
      setImgSrc('');
    }
  };

  const saveCrop = () => {
    if (!selectedForCrop || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const image = new Image();

    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob(blob => {
        if (blob) {
          const croppedFile = new File([blob], selectedForCrop.name, {
            type: selectedForCrop.file.type
          });

          setFiles(prev => prev.map(f => 
            f.id === selectedForCrop.id
              ? {
                  ...f,
                  file: croppedFile,
                  cropData: completedCrop,
                  needsConversion: true,
                  status: 'pending',
                  progress: 0,
                  resultUrl: undefined
                }
              : f
          ));
        }
      }, selectedForCrop.file.type);
    };

    image.src = imgSrc;
    setCropMode(false);
    setSelectedForCrop(null);
    setImgSrc('');
  };

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="main-container bg-white rounded-[2rem] shadow-xl p-8">
        {files.length === 0 ? (
          <label
            className={`upload-area flex flex-col items-center justify-center min-h-[400px] cursor-pointer rounded-[1.5rem]
              ${isDragging ? 'border-primary-600 bg-gray-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Add Images
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag & Drop or Select Images
            </p>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.avif,.bmp,.gif,.ico,.jfif,.tiff,.pdf"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              {files.map(file => (
                <FileItemComponent
                  key={file.id}
                  file={file}
                  onPreview={setSelectedPreview}
                  onDownload={downloadFile}
                  onRemove={removeFile}
                  onFormatChange={handleFormatChange}
                />
              ))}
            </div>

            {showSettings && (
              <div className="bg-white p-4 rounded-[1.25rem] space-y-4">
                <Settings
                  quality={quality}
                  backgroundColor={backgroundColor}
                  hasTransparentFiles={hasTransparentFiles}
                  onQualityChange={(q) => {
                    setQuality(q);
                    setFiles(prev => prev.map(f => ({ ...f, needsConversion: true })));
                  }}
                  onBackgroundColorChange={(color) => {
                    setBackgroundColor(color);
                    setFiles(prev => prev.map(f => ({ ...f, needsConversion: true })));
                  }}
                />
                <div className="pt-4 border-gray-200">
                  <button
                    onClick={() => files.length > 0 && handleCrop(files[0])}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    disabled={files.length === 0}
                  >
                    <CropIcon className="w-4 h-4" />
                    Crop Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons inside the main container */}
        {files.length > 0 && (
          <div className="sticky bottom-0 bg-white  border-gray-200 py-4 px-6 flex justify-between items-center rounded-t-[1.5rem]">
            <div className="flex items-center gap-3">
              <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                Add More
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.avif,.bmp,.gif,.ico,.jfif,.tiff,.pdf"
                  multiple
                  className="hidden"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`rounded-full p-2 transition-colors duration-200
                  ${showSettings ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
              {!allFilesConverted && (
                <button
                  onClick={convertAll}
                  className="btn-primary flex items-center"
                  disabled={files.some(f => f.status === 'converting')}
                >
                  {files.some(f => f.status === 'converting') ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    'Convert All'
                  )}
                </button>
              )}
              {allFilesConverted && (
                <button
                  onClick={downloadAllAsZip}
                  className="btn-primary flex items-center gap-2"
                >
                  <Archive className="w-5 h-5" />
                  Download All
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedPreview && (
        <PreviewModal
          file={selectedPreview}
          onClose={() => setSelectedPreview(null)}
          onDownload={downloadFile}
        />
      )}

      {cropMode && selectedForCrop && (
        <CropModal
          file={selectedForCrop}
          imgSrc={imgSrc}
          crop={crop}
          completedCrop={completedCrop}
          onClose={() => {
            setCropMode(false);
            setSelectedForCrop(null);
            setImgSrc('');
          }}
          onCropChange={setCrop}
          onCropComplete={setCompletedCrop}
          onSave={saveCrop}
        />
      )}
    </div>
  );
}