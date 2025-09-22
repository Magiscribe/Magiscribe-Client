import ContactForm from '@/components/forms/contact-form';
import { useSetTitle } from '@/hooks/title-hook';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();
  useSetTitle()(t('pages.contact.title'));

  return (
    <div className="container mx-auto mt-12 pb-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center">{t('pages.contact.pageTitle')}</h1>
        <ContactForm />
      </motion.div>
    </div>
  );
}
