import ContactForm from '@/components/forms/contact-form';
import { useSetTitle } from '@/hooks/title-hook';
import { motion } from 'motion/react';

export default function ContactPage() {
  useSetTitle()('Contact Us');

  return (
    <div className="container mx-auto mt-12 pb-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Get in Touch</h1>
        <ContactForm />
      </motion.div>
    </div>
  );
}
