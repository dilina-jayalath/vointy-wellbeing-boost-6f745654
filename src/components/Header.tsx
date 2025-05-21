
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-brand-purple">Vointy<span className="text-brand-blue">.io</span></span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-brand-purple transition-colors">Features</a>
            <a href="#benefits" className="text-gray-700 hover:text-brand-purple transition-colors">Benefits</a>
            <a href="#testimonials" className="text-gray-700 hover:text-brand-purple transition-colors">Testimonials</a>
            <Link to="/subscription" className="text-gray-700 hover:text-brand-purple transition-colors">Pricing</Link>
            <Link to="/subscription">
              <Button className="btn-primary">Request Demo</Button>
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white py-4 mt-4 rounded-lg shadow-md animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#benefits" 
                className="text-gray-700 hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Benefits
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <Link 
                to="/subscription" 
                className="text-gray-700 hover:text-brand-purple transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="px-4 py-2">
                <Link to="/subscription" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="btn-primary w-full">Request Demo</Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
