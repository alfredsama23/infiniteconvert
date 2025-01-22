import { Check } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
          Image Converter
        </h1>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-8">
          Convert your images into any format for free. Simply drop your images below to get started – No registration required!
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            
              <Check className="w-5 h-10 text-primary-600" />
           
            <span className="text-sm sm:text-base text-gray-700">Free Forever</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-10 text-primary-600" />
            <span className="text-sm sm:text-base text-gray-700">No Sign Up</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-10 text-primary-600" />
            <span className="text-sm sm:text-base text-gray-700">Instant Convert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
