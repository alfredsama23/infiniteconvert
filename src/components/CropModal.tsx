import { X, ZoomIn, ZoomOut, Loader, RefreshCw } from 'lucide-react';
import ReactCrop, { type Crop } from 'react-image-crop';
import { type FileItem } from '../types';
import 'react-image-crop/dist/ReactCrop.css';
import { useState, useRef, useCallback, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface CropModalProps {
  file: FileItem;
  imgSrc: string;
  crop: Crop | undefined;
  completedCrop: Crop | undefined;
  onClose: () => void;
  onCropChange: (crop: Crop) => void;
  onCropComplete: (crop: Crop) => void;
  onSave: () => void;
  isLoading: boolean;
}

interface Position {
  x: number;
  y: number;
}

export function CropModal({
  imgSrc,
  crop,
  completedCrop,
  onClose,
  onCropChange,
  onCropComplete,
  onSave,
  isLoading,
}: CropModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;

  // Handle zooming in, out, or resetting
  const handleZoom = useCallback((direction: 'in' | 'out' | 'reset') => {
    setScale(prevScale => {
      let newScale: number;

      if (direction === 'reset') {
        newScale = 1; // Reset to default zoom
      } else {
        newScale = direction === 'in' 
          ? prevScale + ZOOM_STEP 
          : prevScale - ZOOM_STEP;
      }

      return Math.min(Math.max(newScale, MIN_ZOOM), MAX_ZOOM);
    });
  }, []);

  // Handle slider zoom change
  const handleSliderChange = useCallback((value: number | number[]) => {
    const newScale = Array.isArray(value) ? value[0] : value;
    setScale(newScale);
  }, []);

  // Handle mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && scale > 1) { // Left click only and only when zoomed in
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position.x, position.y, scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset position and scale when imgSrc changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsImageLoaded(false);
    setHasImageError(false);
  }, [imgSrc]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Crop Image</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : !imgSrc ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p>No image to display.</p>
          </div>
        ) : hasImageError ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <p>Failed to load image.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => handleZoom('out')}
                className="btn-secondary p-2"
                disabled={scale <= MIN_ZOOM}
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <Slider
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={scale}
                onChange={handleSliderChange}
                className="w-32"
              />
              <button
                onClick={() => handleZoom('in')}
                className="btn-secondary p-2"
                disabled={scale >= MAX_ZOOM}
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleZoom('reset')}
                className="btn-secondary p-2"
                title="Reset Zoom"
              >
                <RefreshCw className="w-5 h-5" /> {/* Reset zoom icon */}
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <div 
              ref={containerRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden mb-4"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div className="flex items-center justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => onCropChange(percentCrop)}
                  onComplete={(_, percentCrop) => onCropComplete(percentCrop)}
                  aspect={undefined}
                  className="max-h-[70vh] overflow-auto"
                >
                  <img
                    src={imgSrc}
                    alt="Crop"
                    className="max-w-full h-auto transform-gpu transition-transform duration-200"
                    style={{ 
                      transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                      transformOrigin: 'center center',
                      pointerEvents: isDragging ? 'none' : 'auto',
                      display: isImageLoaded ? 'block' : 'none'
                    }}
                    draggable={false}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => setHasImageError(true)}
                  />
                </ReactCrop>
                {!isImageLoaded && !hasImageError && (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <Loader className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="btn-primary"
            disabled={!completedCrop || isLoading || !isImageLoaded}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}