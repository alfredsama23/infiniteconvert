import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Converter } from './components/Converter';
import { ConversionSteps } from './components/ConversionSteps';
import { SupportedFormats } from './components/SupportedFormats';
import { Footer } from './components/Footer';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { useState } from 'react';

export default function App() { // Add `export default` here
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'privacy' | 'terms'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      default:
        return (
          <main className="flex-grow">
            <Hero />
            <Converter />
            <ConversionSteps />
            <SupportedFormats />
            <Features />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onPageChange={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}