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
import goHomeGif from '../assets/imgs/go-home.gif';

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
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('summary');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);

  const { handleNextNode, form, state, onNodeUpdate } = useInquiry();

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
    <div className="flex flex-col items-center py-4 px-4 md:py-12">
      <div className="w-full max-w-4xl mx-auto">
        <div className="h-3 md:h-4 rounded-t-2xl bg-gradient-to-r from-violet-600 to-pink-600"></div>
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8">
          {/* Start Screen */}
          {screen === 'start' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-indigo-900">{form.title}</h1>
                <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
                {form.description && <p className="mt-4 text-lg md:text-xl text-slate-700">{form.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-lg md:text-xl mb-4 text-slate-700">
                  Ready to start? Click the button below to begin!
                </p>
                <button
                  type="button"
                  onClick={handleStart}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                  Start Your Inquiry
                </button>
              </div>
            </div>
          )}

          {(screen === 'inquiry' || screen === 'end') && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center">{form.title}</h2>
              <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>

              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={clsx('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className={clsx(
                        'max-w-[80%] px-4 py-2 rounded-xl shadow-md',
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'bg-slate-200 text-slate-800',
                      )}
                    >
                      <MarkdownCustom>{message.content as string}</MarkdownCustom>
                    </motion.div>
                  </div>
                ))}
                {state.loading && (
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
                  className="space-y-4"
                >
                  {!state.loading && ((currentNode.data?.type ?? '') as string).startsWith('rating') && (
                    <div>
                      <RatingInput
                        ratings={currentNode.data.ratings as string[]}
                        isMulti={currentNode.data.type === 'rating-multi'}
                        onRatingChange={setSelectedRatings}
                      />
                    </div>
                  )}

                  <hr className="border-gray-300" />

                  {screen === 'inquiry' && (
                    <form onSubmit={handleSubmit} className="flex">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-grow p-2 sm:p-3 border border-slate-300 rounded-l-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={state.loading || (selectedRatings.length === 0 && inputMessage.trim() === '')}
                      >
                        <span className="hidden md:inline">Send</span>
                        <FontAwesomeIcon icon={faPaperPlane} className="ml-0 md:ml-2" />
                      </button>
                    </form>
                  )}

                  {screen === 'end' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setScreen('summary')}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        Finish Inquiry
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {screen === 'summary' && (
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">{form.title}</h2>
              <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
              <p className="text-lg md:text-xl text-slate-700">
                Your responses have been recorded.
                <br />
              </p>
              <p className="text-lg md:text-xl text-slate-700">Thank you for your time... you can leave now!</p>
              <img src={goHomeGif} alt="Thank You" className="mx-auto rounded-3xl" />
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
