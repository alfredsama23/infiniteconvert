import { Users, Zap, Heart } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About InfiniteConvert
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about making image conversion accessible to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To provide the fastest, most reliable image conversion tools that anyone can use, completely free.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Our Technology</h3>
            <p className="text-gray-600">
              Built with cutting-edge web technologies to process your images directly in the browser for maximum speed and privacy.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Our Values</h3>
            <p className="text-gray-600">
              We believe in privacy, simplicity, and providing value to our users without compromising on quality.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-8">
              InfiniteConvert was born from a simple idea: everyone should have access to powerful image conversion tools without the need for complex software or technical knowledge. We've built our platform with a focus on speed, simplicity, and user privacy.
            </p>
            <p className="text-gray-600 mb-8">
              Our team consists of passionate developers and designers who are committed to creating the best possible experience for our users. We process all conversions directly in your browser, ensuring your files never leave your device.
            </p>
            <p className="text-gray-600">
              Today, we're proud to serve users from all around the world, helping them convert millions of images every month. And we're just getting started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}