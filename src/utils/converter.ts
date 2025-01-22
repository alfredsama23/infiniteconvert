import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/utils/pdf.worker.mjs';

// Add new function to convert PDF to image
export async function convertPDFToImage(file: File): Promise<{ url: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ url: URL.createObjectURL(blob) });
        } else {
          reject(new Error('Failed to convert PDF to image'));
        }
      },
      'image/jpeg',
      0.95
    );
  });
}

export async function convertImage(
  file: FileItem,
  format: ConversionFormat,
  quality: number,
  backgroundColor: string
): Promise<{ url: string; hasTransparency?: boolean; convertedSize: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      // Handle PDF input
      if (file.file.type === 'application/pdf') {
        const { url } = await convertPDFToImage(file.file);
        
        // Create a new File object from the converted image
        const response = await fetch(url);
        const blob = await response.blob();
        const convertedFile = new File([blob], file.name.replace('.pdf', '.jpg'), { type: 'image/jpeg' });
        
        // Convert the image to the desired format
        const result = await convertImage(
          { ...file, file: convertedFile },
          format,
          quality,
          backgroundColor
        );
        
        resolve(result);
        return;
      }

      // Handle image input
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Check for transparency only for PNG files
        let hasTransparency = false;
        if (file.file.type === 'image/png') {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          tempCtx.drawImage(img, 0, 0);
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          hasTransparency = checkTransparency(imageData);
        }

        // Apply background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(img, 0, 0);

        try {
          if (format === 'pdf') {
            // Convert to PDF
            const pdf = new jsPDF({
              orientation: img.width > img.height ? 'landscape' : 'portrait',
              unit: 'px',
              format: [img.width, img.height],
            });

            const imgData = canvas.toDataURL('image/jpeg', quality / 100);
            pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);

            const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
            const convertedSize = formatFileSize(pdfBlob.size);
            resolve({
              url: URL.createObjectURL(pdfBlob),
              hasTransparency,
              convertedSize,
            });
          } else {
            // Convert to other image formats
            let mimeType: string;
            let qualityValue = quality / 100;

            switch (format) {
              case 'jpg':
              case 'jfif':
                mimeType = 'image/jpeg';
                break;
              case 'png':
                mimeType = 'image/png';
                qualityValue = undefined!;
                break;
              case 'webp':
                mimeType = 'image/webp';
                break;
              case 'avif':
                mimeType = 'image/avif';
                break;
              case 'bmp':
                mimeType = 'image/bmp';
                qualityValue = undefined!;
                break;
              case 'gif':
                mimeType = 'image/gif';
                qualityValue = undefined!;
                break;
              case 'ico':
                mimeType = 'image/x-icon';
                qualityValue = undefined!;
                break;
              case 'tiff':
                mimeType = 'image/tiff';
                break;
              default:
                mimeType = 'image/jpeg';
            }

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({
                    url: URL.createObjectURL(blob),
                    hasTransparency,
                    convertedSize: formatFileSize(blob.size),
                  });
                } else {
                  reject(new Error('Failed to create image blob'));
                }
              },
              mimeType,
              qualityValue
            );
          }
        } catch (error) {
          reject(new Error(`Image conversion failed: ${error.message}`));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file.file);
    } catch (error) {
      reject(error);
    }
  });
}

function checkTransparency(imageData: ImageData): boolean {
  const data = imageData.data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true;
    }
  }
  return false;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}