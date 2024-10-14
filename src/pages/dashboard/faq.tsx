import GenericHero from '@/components/heroes/generic-hero';
import { useSetTitle } from '@/hooks/title-hook';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React from 'react';

const faqs = [
  {
    question: 'What are inquiries?',
    answer:
      "Magiscribe inquiries are structured conversations about a particular topic that allow for dynamic follow-up. Imagine you are interviewing a customer about your product. You'd probably have a certain set of questions that you want to make sure you ask them, as well as potentially coming up with dynamic follow-up questions on the fly if your interviewee says something interesting. Our inquiries allow you to configure a structured, yet nuanced discussion that you can distribute to stakeholders at scale.",
  },
  {
    question: 'Who would want to create an inquiry?',
    answer:
      'Anyone that wants to receive feedback from a large number of people. If you want more depth than surveys and less time than interviews, an inquiry could be perfect for you to collect stakeholder insights.',
  },
  {
    question: 'How do I create an inquiry?',
    answer:
      'To create an inquiry you hit the big blue plus button on the dashboard. From there a modal will pop up and allow you to choose a template or start from scratch. If you choose a template, you\'ll have the opportunity to let an AI customize the template to your use case (recommended). From there, further modifications to the conversation graph can be done manually or with the "Graph Editor" chat window on the right side of the "Builder". ',
  },
  {
    question: 'How do I achieve structure in my inquiries?',
    answer:
      'Magiscribe Inquiries are modeled using a directed conversation graph. As you may know, graphs consist of nodes and edges. There are five types of nodes: Start, Information, Question, Condition, and End. The conversation must progress from a Start node to an End node. In between, paths through the graph represent the different possible conversation flows that a user could have.',
  },
  {
    question: 'What does it mean when a question node or an information node has "Dynamic Generation" enabled?',
    answer:
      'When "Dynamic Generation" is enabled, this indicates that the text in the node will serve as an instruction to an LLM to generate content on the fly based on that instruction and the entire conversation history. If "Dynamic Generation" is not selected then the text in the textarea will be displayed directly to the user.',
  },
  {
    question: 'What are the different types of questions that can be asked?',
    answer:
      'Questions can either be open-ended, rating-single, or rating-multi. Open-ended questions allow the user to provide text response. Rating-single gives the respondent a list of options and lets them pick exactly one. Rating-multi allows the respondent to choose all that apply amongst a list of options.',
  },
  {
    question: 'What do each of the node types do?',
    answer:
      "The start node represents the beginning of the conversation flow. The information node provides information to the user without requiring a response. The question node represents a point where the user is asked a question. The condition node allows for the conversation to take a different path based on the user's response. The end node represents the end of the conversation flow.",
  },
  {
    question: 'What do the edges do?',
    answer:
      'The edges link nodes together in a directed fashion. If the user is at question node "A" and there exists an edge between node "A" and information node "B", once they answer the question they\'ll be routed to node "B". ',
  },
  {
    question: 'What are the graph rules? ',
    answer:
      'There can only be one start node and there must be at least one end node. Every other type of node must have at least one incoming and outgoing edge. There must be at least one question node. Information nodes and question nodes can have multiple incoming edges, but only one outgoing edge. Condition nodes can have multiple incoming edges and must have multiple outgoing edges.',
  },
  {
    question: 'How do I distribute my inquiry?',
    answer:
      'We will only allow you to distribute inquiries with valid conversation graphs. To attempt to do this, click "Publish" on the "Builder" tab of your inquiry. If your graph is valid, you\'ll get a link to send out to people. Anyone who has that link will be able to respond directly to your inquiry. If your graph is not valid, a list of errors will be displayed. You can attempt to let the AI "Automagically Fix" the errors and then try publishing it again.',
  },
  {
    question: 'What if I change my graph after publishing it?',
    answer:
      'We will save any changes you make in the graph builder to a "draft Graph". We will only update the public inquiry that people receive when you hit "Publish" and all validation checks pass. Our system is flexible enough to allow you to add or remove questions and be backwards compatible with previous versions of your graph!',
  },
  {
    question: 'Are inquiries anonymous?',
    answer:
      'Currently, every inquiry puts the choice as to whether or not to be identified in the hands of the respondent. Before starting the inquiry itself, a respondent will have the choice to optionally fill in their name and email. If these are left blank the responses will be recorded anonymously.',
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
