import { ArrowRight } from 'lucide-react';

export function SupportedFormats() {
  const formats = [
    'AVIF', 'BMP', 'GIF',
    'ICO', 'JFIF', 'JPG',
    'PNG', 'PSD', 'SVG', 
    'TIFF', 'WEBP'
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Supported Formats
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Convert between any of these image formats with ease
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {formats.map((format) => (
            <div
              key={format}
              className="bg-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 w-[160px]"
            >
              <span className="font-medium text-gray-900">{format}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}