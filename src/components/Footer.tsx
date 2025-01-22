import { Infinity, Github, Twitter, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FooterProps {
  onPageChange: (page: 'home' | 'about' | 'contact' | 'privacy' | 'terms') => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is installed
    const checkInstallation = () => {
      setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);
    };

    checkInstallation();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(checkInstallation);

    return () => mediaQuery.removeListener(checkInstallation);
  }, []);

  const handleUninstall = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    // Show instructions to the user
    const message = 'To complete uninstallation:\n\n' +
      '1. Open your browser settings\n' +
      '2. Find "Apps" or "Installed Apps"\n' +
      '3. Locate "InfiniteConvert"\n' +
      '4. Click "Remove" or "Uninstall"';
    
    alert(message);
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div 
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => onPageChange('home')}
            >
             <Infinity className="w-10 h-10 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">InfiniteConvert</span>
            </div>
            <p className="text-gray-600 mb-6">
              Free online image converter. Convert your images to any format without losing quality.
              No registration required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onPageChange('about')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('privacy')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('terms')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange('contact')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </button>
              </li>
              {isInstalled && (
                <li>
                  <button 
                    onClick={handleUninstall}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Uninstall App
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Github"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {currentYear} InfiniteConvert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
