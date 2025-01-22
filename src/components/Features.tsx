import { Zap, DollarSign, Images, Code2, UserCircle, Shield } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: "Fastest Converter",
      description: "Using the latest technologies, we process the conversion in your browser, saving you time by skipping the upload."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary-600" />,
      title: "Ad-Free",
      description: "We operate the image converter entirely free and without running any banner ads. Enjoy an uncluttered experience."
    },
    {
      icon: <Images className="w-8 h-8 text-primary-600" />,
      title: "Batch-Convert Any Formats",
      description: "Convert your images into any format individually or process multiple files in bulk to speed things up."
    },
    {
      icon: <Code2 className="w-8 h-8 text-primary-600" />,
      title: "Browser-Based",
      description: "The conversion happens in your browser, meaning it's fast, private, and you don't have to install software."
    },
    {
      icon: <UserCircle className="w-8 h-8 text-primary-600" />,
      title: "Easy-to-Use",
      description: "InfiniteConvert free online converter is designed to be simple and intuitive for a frictionless user experience."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Private & Secure",
      description: "We can't store or see your images as they are processed directly in your browser – no uploads to our server."
    }
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Our Converter?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience the fastest, most secure way to convert PNG to JPG
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-white hover:bg-gray-100 transition-colors duration-300 flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>

              {/* Title and Description */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}