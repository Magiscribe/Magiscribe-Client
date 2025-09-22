import ContentSection from '@/components/content-section';
import { useSetTitle } from '@/hooks/title-hook';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        className="mt-2"
      >
        {answer}
      </motion.div>
    </motion.div>
  );
}

export default function UserGuide() {
  const { t } = useTranslation();
  
  // Get localized user guide content
  const userGuide = [
    {
      question: t('userGuide.questions.whatAreInquiries.question'),
      answer: t('userGuide.questions.whatAreInquiries.answer'),
    },
    {
      question: t('userGuide.questions.howToCreateInquiry.question'),
      answer: t('userGuide.questions.howToCreateInquiry.answer'),
    },
    {
      question: t('userGuide.questions.howToAchieveStructure.question'),
      answer: t('userGuide.questions.howToAchieveStructure.answer'),
    },
    {
      question: t('userGuide.questions.whatIsDynamicGeneration.question'),
      answer: t('userGuide.questions.whatIsDynamicGeneration.answer'),
    },
    {
      question: t('userGuide.questions.whatAreQuestionTypes.question'),
      answer: t('userGuide.questions.whatAreQuestionTypes.answer'),
    },
    {
      question: t('userGuide.questions.whatDoNodeTypesDo.question'),
      answer: t('userGuide.questions.whatDoNodeTypesDo.answer'),
    },
    {
      question: t('userGuide.questions.whatDoEdgesDo.question'),
      answer: t('userGuide.questions.whatDoEdgesDo.answer'),
    },
    {
      question: t('userGuide.questions.whatAreGraphRules.question'),
      answer: t('userGuide.questions.whatAreGraphRules.answer'),
    },
    {
      question: t('userGuide.questions.howToDistributeInquiry.question'),
      answer: t('userGuide.questions.howToDistributeInquiry.answer'),
    },
    {
      question: t('userGuide.questions.whatIfChangeGraphAfterPublishing.question'),
      answer: t('userGuide.questions.whatIfChangeGraphAfterPublishing.answer'),
    },
    {
      question: t('userGuide.questions.areInquiriesAnonymous.question'),
      answer: t('userGuide.questions.areInquiriesAnonymous.answer'),
    },
  ];

  useSetTitle()(t('userGuide.title'));

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-8 py-12 text-white">
        <ContentSection
          title={t('userGuide.title')}
          description={t('userGuide.subtitle')}
          reversed={false}
          content={
            <div className="max-w-6xl mx-auto prose prose-invert">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">{t('userGuide.videoTitle')}</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-96"
                    src="https://www.youtube.com/embed/45l_kHRTmdY?si=DQZnYOwZOL1qih1N"
                    title={t('media.youtubeVideoPlayer')}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">{t('userGuide.faqTitle')}</h2>
                <div className="space-y-4">
                  {userGuide.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}
