import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import logoIcon from '@/assets/imgs/logo-icon.svg';

export function AnimatedLogo() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="font-display no-underline hover:no-underline font-bold text-2xl lg:text-4xl mt-2 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.img
        src={logoIcon}
        alt="Magiscribe Wand Icon"
        className="w-12 mr-3 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
        {t('common.brand.name')}
      </motion.span>
    </motion.div>
  );
}
