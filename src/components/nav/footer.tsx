import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-0 sm:py-6 md:py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col justify-between items-center">
          <p className="text-sm text-white text-center md:text-left mt-4 md:mt-0">
            © {new Date().getFullYear()} Magiscribe. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2 text-sm text-white/80">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
