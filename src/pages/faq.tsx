import { useSetTitle } from '@/hooks/title-hook';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { motion } from 'motion/react';
import React from 'react';

const faqs = [
  {
    question: 'What is Magiscribe?',
    answer:
      "Magiscribe is a user-friendly tool that revolutionizes how organizations gather insights from their audience. Unlike traditional surveys or time-intensive interviews, we offer dynamic, interactive conversations that adapt to each respondent, delivering deeper insights while saving you valuable time. Whether you're conducting market research, gathering customer feedback, or collecting stakeholder input, Magiscribe makes it effortless to create engaging, personalized interactions at scale.",
  },
  {
    question: 'How is Magiscribe different from traditional surveys?',
    answer:
      "While traditional surveys are static and often miss crucial context, Magiscribe creates dynamic conversations that adapt based on your respondents' answers. Our platform combines the depth of personal interviews with the scalability of surveys, allowing you to capture nuanced feedback without the time investment of individual interviews. Plus, our smart follow-up system ensures you never miss important insights, automatically exploring interesting responses in greater detail.",
  },
  {
    question: 'Who is Magiscribe for?',
    answer:
      "Magiscribe is perfect for anyone who needs meaningful insights from their audience, including market researchers, product managers, customer experience teams, and business strategists. Our platform is particularly valuable for organizations that want to scale their research efforts without sacrificing depth and quality. Whether you're a startup gathering customer feedback or an enterprise conducting large-scale market research, Magiscribe adapts to your needs.",
  },
  {
    question: 'What kinds of insights can I gather with Magiscribe?',
    answer:
      'Magiscribe is incredibly versatile. You can use it for customer feedback, product research, market analysis, user experience studies, employee feedback, and much more. Our platform excels at uncovering the "why" behind responses through intelligent follow-up questions, helping you gather both quantitative data and qualitative insights in a single interaction.',
  },
  {
    question: 'How easy is it to get started?',
    answer:
      'Getting started with Magiscribe is simple. Our platform offers ready-to-use templates for common use cases, which you can customize to your specific needs with just a few clicks. We also provide AI-powered assistance to help you craft the perfect questions and conversation flows. You can create your first inquiry in minutes and start gathering insights right away.',
  },
  {
    question: 'How does Magiscribe ensure quality responses?',
    answer:
      "Our dynamic conversation approach naturally encourages more thoughtful and detailed responses. By adapting to each respondent's answers and asking relevant follow-up questions, we create an engaging experience that yields higher quality insights.",
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
        className={clsx('overflow-hidden', { 'max-h-0': !isOpen, 'max-h-screen': isOpen })}
        onClick={() => setIsOpen(!isOpen)}
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
      <div className="container mx-auto mt-12 pb-16">
        <motion.div
          className="max-w-2xl mx-auto prose prose-invert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">FAQ</h1>
          <p className="mt-4">Learn how Magiscribe can turn dialogue into discovery</p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
