import { Infinity as InfinityIcon, MessageCircle, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onPageChange: (page: 'home' | 'about' | 'contact' | 'privacy' | 'terms') => void;
  currentPage: string;
}

export function Header({ onPageChange, currentPage }: HeaderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onPageChange('home')}
          >
            <Infinity className="w-10 h-10 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">InfiniteConvert</span>
          </div>
          <div className="flex items-center gap-6">
            Need Help?
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center justify-center bg-primary-100 text-primary-600 px-4 sm:px-6 h-10 rounded-full font-medium hover:bg-primary-200 transition-colors duration-200"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
            <button
              onClick={() => onPageChange('contact')}
              className="inline-flex items-center justify-center bg-primary-600 text-white px-4 sm:px-6 h-10 rounded-full font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
