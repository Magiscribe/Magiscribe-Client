import GenericHero from '@/components/heroes/generic-hero';
import { useSetTitle } from '@/hooks/title-hook';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React from 'react';

const faqs = [
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
  {
    question: 'Lorem ipsum dolor sit.',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel possimus sed quaerat temporibus dolorum, accusamus, sit odit dolores error optio iusto dolor aperiam repellat quae fugit similique facere nulla harum!',
  },
];

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

export default function FAQPage() {
  useSetTitle()('Frequently Asked Questions');

  return (
    <>
      <GenericHero title="Frequently Asked Questions" subtitle="Find answers to common questions about Magiscribe." />
      <div className="container mx-auto mt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </>
  );
}
