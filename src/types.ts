export type ConversionFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'bmp' | 'gif' | 'ico' | 'jfif' | 'tiff' | 'pdf';

export interface FileItem {
  id: string;
  name: string;
  size: string;
  convertedSize?: string;
  status: 'pending' | 'converting' | 'done';
  progress: number;
  file: File;
  resultUrl?: string;
  hasTransparency?: boolean;
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  needsConversion?: boolean;
  outputFormat?: ConversionFormat;
}