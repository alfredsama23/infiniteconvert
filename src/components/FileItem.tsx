import { ImageIcon, Download, X, ChevronDown, ArrowRight } from 'lucide-react';
import { type FileItem as FileItemType, type ConversionFormat } from '../types';
import { useState, useEffect } from 'react';

interface FileItemProps {
  file: FileItemType;
  onPreview: (file: FileItemType) => void;
  onDownload: (file: FileItemType) => void;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: ConversionFormat) => void;
}

export function FileItem({ file, onPreview, onDownload, onRemove, onFormatChange }: FileItemProps) {
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [hasTransparency, setHasTransparency] = useState(false);

  useEffect(() => {
    const checkTransparency = async () => {
      if (file.file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] < 255) {
                setHasTransparency(true);
                return;
              }
            }
            setHasTransparency(false);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file.file);
      }
    };

    checkTransparency();
  }, [file]);

  const formats = [
    { value: 'avif', label: 'AVIF' },
    { value: 'bmp', label: 'BMP' },
    { value: 'gif', label: 'GIF' },
    { value: 'ico', label: 'ICO' },
    { value: 'jfif', label: 'JFIF' },
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'pdf', label: 'PDF' },
    { value: 'tiff', label: 'TIFF' },
    { value: 'webp', label: 'WEBP' }
  ];

  const getFileType = (type: string) => {
    switch (type) {
      case 'image/jpeg':
        return 'JPG';
      case 'image/png':
        return 'PNG';
      case 'image/webp':
        return 'WebP';
      case 'image/avif':
        return 'AVIF';
      case 'image/bmp':
        return 'BMP';
      case 'image/gif':
        return 'GIF';
      case 'image/x-icon':
        return 'ICO';
      case 'image/tiff':
        return 'TIFF';
      case 'application/pdf':
        return 'PDF';
      default:
        return 'Image';
    }
  };

  const currentFormat = formats.find((f) => f.value === file.outputFormat)?.label || 'JPG';
  const fileName = file.name.split('.').slice(0, -1).join('.') || file.name;

  return (
    <div className="file-item rounded-[1.25rem]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900">{fileName}</h4>
            {hasTransparency && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Transparent
              </span>
            )}
            {file.cropData && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                Cropped
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {getFileType(file.file.type)}
            </span>
            {file.size && file.convertedSize ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">{file.size}</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {file.convertedSize}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">{file.size}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {file.status === 'converting' && (
          <div className="w-32">
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <span>{currentFormat}</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {isFormatDropdownOpen && (
            <div className="absolute z-10 mt-2 p-2 bg-white border border-gray-200 rounded-2xl shadow-lg w-[300px] max-h-[300px] overflow-y-auto right-0">
              <div className="grid grid-cols-2 gap-2">
                {formats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => {
                      onFormatChange(file.id, format.value as ConversionFormat);
                      setIsFormatDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl text-center transition-colors border border-gray-200"
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {file.resultUrl && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPreview(file)}
              className="btn-secondary"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDownload(file)}
              className="btn-secondary"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
        <button
          onClick={() => onRemove(file.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}