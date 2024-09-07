import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-0 sm:py-6 md:py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col justify-between items-center">
          <p className="text-sm text-white text-center md:text-left mt-4 md:mt-0">
            © {new Date().getFullYear()} Magiscribe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
