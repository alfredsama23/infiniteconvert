import { X } from 'lucide-react';
import { type FileItem } from '../types';

interface PreviewModalProps {
  file: FileItem;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
}

export function PreviewModal({ file, onClose, onDownload }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Preview</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img 
            src={file.resultUrl} 
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
          <button
            onClick={() => {
              onDownload(file);
              onClose();
            }}
            className="btn-primary"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}