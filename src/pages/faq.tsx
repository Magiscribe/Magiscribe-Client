import { useSetTitle } from '@/hooks/title-hook';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { motion } from 'motion/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div className="border-b border-white py-4" initial={false} transition={{ duration: 0.3 }}>
      <button
        className="flex justify-between items-center w-full text-left font-bold text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`ml-2 transition-transform transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className={clsx('overflow-hidden', { 'max-h-0': !isOpen, 'max-h-screen': isOpen })}
        onClick={() => setIsOpen(!isOpen)}
      >
        {answer}
      </motion.div>
    </motion.div>
  );
}

export default function FAQPage() {
  const { t } = useTranslation();
  useSetTitle()(t('pages.faq.title'));

  const faqKeys = ['whatIsMagiscribe', 'howDifferent', 'whoIsItFor', 'whatInsights', 'howEasy', 'qualityResponses'];

  return (
    <>
      <div className="container mx-auto mt-12 pb-16">
        <motion.div
          className="max-w-2xl mx-auto prose prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">FAQ</h1>
          <p className="mt-4">{t('pages.faq.subtitle')}</p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {faqKeys.map((key, index) => (
              <FAQItem
                key={index}
                question={t(`pages.faq.questions.${key}.question`)}
                answer={t(`pages.faq.questions.${key}.answer`)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
