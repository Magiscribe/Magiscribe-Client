import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-0 sm:py-6 md:py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col justify-between items-center">
          <p className="text-sm text-white text-center md:text-left mt-4 md:mt-0">
            {t('common.labels.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4 mt-2 text-sm text-white/80">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('common.navigation.privacy')}
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              {t('common.navigation.terms')}
            </Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-white transition-colors">
              {t('common.navigation.faq')}
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              {t('common.navigation.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
