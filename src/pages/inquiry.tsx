import AnimatedDots from '@/components/animated/animated-dots';
import { FeatureCard } from '@/components/cards/feature-card';
import { ChartProps } from '@/components/chart';
import RatingInput from '@/components/graph/rating-input';
import MarkdownCustom from '@/components/markdown-custom';
import { InquiryProvider, useInquiry } from '@/providers/inquiry-provider';
import { StrippedNode } from '@/utils/graphs/graph';
import { faChevronRight, faComments, faLightbulb, faPaperPlane, faRocket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Represents a message in the chat.
 */
interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

/**
 * Main Inquiry component that handles the chat interface and inquiry flow.
 */
function Inquiry() {
  const { id } = useParams<{ id: string }>();
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('start');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);

  const { handleNextNode, form, loading, onNodeUpdate } = useInquiry();

  const handleStart = () => {
    setScreen('inquiry');
    handleNextNode();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' && selectedRatings.length === 0) return;

    const userMessage = [...selectedRatings, inputMessage.trim()].filter(Boolean).join(' - ');

    setMessages((prev) => [...prev, { type: 'text', content: userMessage, sender: 'user' }]);
    handleNextNode({
      data: {
        text: inputMessage,
        ...(selectedRatings.length > 0 && { ratings: selectedRatings }),
      },
    });
    setInputMessage('');
    setSelectedRatings([]);
  };

  const onNodeVisit = (node: StrippedNode) => {
    if (node.type === 'end') {
      console.log('End node reached');
      setScreen('end');
      return;
    }

    if (node.type === 'information' || node.type === 'conversation') {
      setMessages((prev) => [...prev, { type: 'text', content: node.data.text as string, sender: 'bot' }]);
      setCurrentNode(node);

      if (node.type === 'information') {
        setTimeout(() => handleNextNode(), 1000);
      }
    }
  };

  useEffect(() => {
    onNodeUpdate(onNodeVisit);
  }, [onNodeUpdate]);

  if (!id || !form) return null;

  return (
    <div className="flex flex-col items-center mt-12 mb-12">
      <div className="max-w-6xl w-full mx-auto">
        <div className="h-12 rounded-t-3xl bg-gradient-to-r from-violet-600 to-pink-600 text-white"></div>
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          {/* Start Screen */}
          {screen === 'start' && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-6 text-indigo-900">{form.title}</h1>
                <div className="h-1 mx-auto gradient w-64 opacity-50 my-4 py-0 rounded-t"></div>
                {form.description && <p className="text-xl mb-8 text-gray-700">{form.description}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <FeatureCard
                  icon={faRocket}
                  title="Fast"
                  description="Only spend as much time as you want to."
                  color="bg-gradient-to-r from-indigo-600 to-violet-600"
                />
                <FeatureCard
                  icon={faComments}
                  title="Interactive"
                  description="Express exactly what you want to say with ease."
                  color="bg-gradient-to-r from-violet-600 to-purple-600"
                />
                <FeatureCard
                  icon={faLightbulb}
                  title="Feedback"
                  description="Get instant feedback on your responses."
                  color="bg-gradient-to-r from-purple-600 to-fuchsia-600"
                />
              </div>

              <div className="text-center">
                <p className="text-xl mb-8 text-gray-700">Ready to start? Click the button below to begin!</p>
                <button
                  type="button"
                  onClick={handleStart}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                  Start Your Inquiry
                </button>
              </div>
            </>
          )}

          {(screen === 'inquiry' || screen === 'end') && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-indigo-900 text-center">{form.title}</h2>
              <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t mb-8"></div>

              <div className="flex-grow mb-8 rounded-lg max-h-[60vh]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={clsx('mb-4 flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className={clsx(
                        'shadow-lg max-w-[80%] px-3 py-2 rounded-xl',
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-slate-200 text-gray-800',
                      )}
                    >
                      <MarkdownCustom>{message.content as string}</MarkdownCustom>
                    </motion.div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start items-center pt-4 pl-4">
                    <AnimatedDots />
                  </div>
                )}
              </div>

              {currentNode && currentNode.type !== 'end' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {!loading && ((currentNode.data?.type ?? '') as string).startsWith('rating') && (
                    <div className="mb-6">
                      <RatingInput
                        ratings={currentNode.data.ratings as string[]}
                        isMulti={currentNode.data.type === 'rating-multi'}
                        onRatingChange={setSelectedRatings}
                      />
                    </div>
                  )}

                  <hr className="my-4" />

                  {screen === 'inquiry' && (
                    <form onSubmit={handleSubmit} className="flex">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-grow p-2 border border-slate-300 rounded-l-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading || (selectedRatings.length === 0 && inputMessage.trim() === '')}
                      >
                        Send
                        <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
                      </button>
                    </form>
                  )}

                  {screen === 'end' && (
                    <div className="flex w-full items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setScreen('summary')}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        Finish Inquiry
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}

          {screen === 'summary' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-indigo-900">{form.title}</h2>
              <div className="h-1 mx-auto gradient w-64 opacity-50 my-0 py-0 rounded-t mb-8"></div>
              <p className="text-xl mb-8 text-gray-700">
                Thank you for completing the inquiry. Your responses have been recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper component that provides the InquiryProvider context.
 */
export default function InquiryWrapper() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <InquiryProvider id={id}>
      <Inquiry />
    </InquiryProvider>
  );
}
