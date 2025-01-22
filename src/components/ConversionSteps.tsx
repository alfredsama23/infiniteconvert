import { ArrowDownToLine, ArrowUpToLine, RefreshCw } from 'lucide-react';

export function ConversionSteps() {
  const steps = [
    {
      icon: <ArrowUpToLine className="w-8 h-8 text-primary-600" />,
      title: "1. Choose Images",
      description: "Simply upload or drag and drop your images into the browser."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-primary-600" />,
      title: "2. Start Conversion",
      description: "Choose your desired output format for the image conversion."
    },
    {
      icon: <ArrowDownToLine className="w-8 h-8 text-primary-600" />,
      title: "3. Download Images",
      description: "Once the conversion is done, download your converted images."
    }
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            How to Convert Images to any Format?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}