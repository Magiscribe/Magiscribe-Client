import AnimatedDots from '@/components/animated/animated-dots';
import { FeatureCard } from '@/components/cards/feature-card';
import { ChartProps } from '@/components/chart';
import RatingInput from '@/components/graph/rating-input';
import MarkdownCustom from '@/components/markdown-custom';
import { useTranscribe } from '@/hooks/audio-hook';
import { useSetTitle } from '@/hooks/title-hook';
import { InquiryProvider, useInquiry } from '@/providers/inquiry-provider';
import { StrippedNode } from '@/utils/graphs/graph';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { faChevronRight, faComments, faLightbulb, faPaperPlane, faRocket } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import goHomeGif from '../assets/imgs/go-home.gif';

/**
 * Represents a message in the chat.
 */
interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

const emailRegex = /.+@.+\..+/;
const validFieldCSS =
  'w-full p-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500';
const invalidFieldCSS =
  'w-full p-3 border border-red-700 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500';

/**
 * Container component that provides a gradient background and rounded corners.
 */
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center py-4 px-4 md:py-12">
    <div className="w-full max-w-4xl mx-auto">
      <div className="h-3 md:h-4 rounded-t-2xl bg-gradient-to-r from-violet-600 to-pink-600"></div>
      <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8">{children}</div>
    </div>
  </div>
);

/**
 * Main Inquiry component that handles the chat interface and inquiry flow.
 */
function UserInquiryPage() {
  // States
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('start');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);
  const { isTranscribing, transcript, handleTranscribe } = useTranscribe();
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  // Navigation Hooks
  const navigate = useNavigate();

  // Inquiry hooks
  const { id, preview, handleNextNode, form, state, onNodeUpdate, userDetails, setUserDetails } = useInquiry();

  const setUserEmail = React.useCallback(
    (email: string) => {
      setUserDetails({ ...userDetails, email: email });
      if (emailRegex.test(email) || !email) {
        setIsValidEmail(true);
      } else {
        setIsValidEmail(false);
      }
    },
    [setUserDetails],
  );

  if (!id || !form) return null;

  const handleStart = async () => {
    if (!isValidEmail) {
      // Don't store emails with invalid syntax
      setUserDetails({ ...userDetails, email: '' });
    }
    setScreen('inquiry');
    await handleNextNode();
  };

  const handleFinishInquiry = () => {
    if (preview) {
      // Close the current tab if in preview mode
      window.close();
    }

    setScreen('summary');
  };

  const handleReset = () => {
    // Force a reload of the page to reset.
    // Ref: https://stackoverflow.com/questions/46820682/how-do-i-reload-a-page-with-react-router
    navigate(0);
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
      setScreen('end');
      return;
    }

    if (node.type === 'information' || node.type === 'conversation') {
      setMessages((prev) => [...prev, { type: 'text', content: node.data.text as string, sender: 'bot' }]);
      setCurrentNode(node);

      if (node.type === 'information') {
        // Delay so that at the very beginning we don't save two copies of the response. 100ms causes the problem, 200ms is fine.
        // TODO: Come up with a better solution.
        setTimeout(() => handleNextNode(), 200);
      }
    }
  };

  /**
   * Updates the prompt with the transcript.
   * @param transcript {string} The transcript.
   * @returns {void}
   * @sideeffect Updates the prompt with the transcript.
   */
  useEffect(() => {
    if (isTranscribing) {
      setInputMessage((current) => current + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    onNodeUpdate(onNodeVisit);
  }, [onNodeUpdate]);

  useSetTitle()(form?.title);

  if (state.notFound) {
    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center">Inquiry Not Found</h2>
        <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
        <p className="mt-4 text-lg text-slate-700">
          The inquiry you are looking for does not exist. Please check the URL and try again.
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center">Something went wrong!</h2>
        <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
        <p className="mt-4 text-lg text-slate-700">
          Looks like something broke on our end. Your previous answers have been recorded. Please feel free to try
          again.
        </p>
        <button onClick={() => handleReset()} className="text-indigo-600 hover:underline mt-4">
          Restart Inquiry
        </button>
      </div>
    );
  }

  if (screen === 'start') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center">{form.title}</h2>
          <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
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

        {/* Ask for name and email */}
        {!preview && (
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-indigo-900">Before we begin...</h3>
            <p className="text-lg text-slate-700">
              We would like to know a little bit about you before we start. These are not required fields, but we would
              appreciate it if you could fill them out.
            </p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                  value={userDetails.name}
                  className={validFieldCSS}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  value={userDetails.email}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={isValidEmail ? validFieldCSS : invalidFieldCSS}
                />
                {!isValidEmail && <p className="text-sm text-red-700">Please enter a valid email address.</p>}
              </div>
            </form>
          </div>
        )}

        <div className="text-center">
          <p className="text-lg mb-4 text-slate-700">Ready to start? Click the button below to begin!</p>
          <button
            type="button"
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Start Inquiry
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'inquiry' || screen === 'end') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center">{form.title}</h2>
        <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={clsx('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
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
            {!state.loading && screen !== 'end' && ((currentNode.data?.type ?? '') as string).startsWith('rating') && (
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
                <div className="rounded-l-full flex-grow flex border border-slate-300">
                  <button
                    type="button"
                    className="focus:outline-none text-black px-4 py-2 rounded-lg ml-2 mr-2 hover:from-indigo-700 hover:to-purple-700 transition-colors"
                    onClick={handleTranscribe}
                  >
                    <FontAwesomeIcon
                      icon={isTranscribing ? faMicrophone : faMicrophoneSlash}
                      className={isTranscribing ? 'text-green-500' : ''}
                    />
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow p-2 sm:p-3 rounded-l-full text-slate-800 focus:outline-none"
                  />
                </div>
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
                  onClick={handleFinishInquiry}
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
    );
  }

  if (screen === 'summary') {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">{form.title}</h2>
        <div className="h-1 mx-auto w-32 md:w-64 bg-gradient-to-r from-violet-600 to-pink-600 opacity-50 rounded-full"></div>
        <p className="text-lg text-slate-700">
          Your responses have been recorded.
          <br />
        </p>

        <img src={goHomeGif} alt="Thank You" className="mx-auto rounded-3xl" />
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {/* Form */}
          <p className="text-lg text-center text-gray-600 mt-4">
            Want to make your own inquiry?{' '}
            <SignedOut>
              <SignUpButton signInForceRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
                <button className="px-3 ml-1 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Get Alpha Access
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard/inquiry-builder"
                className="px-3 ml-1 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Go to Graph Builder
              </Link>
            </SignedIn>
          </p>
        </div>
      </div>
    );
  }

  return <></>;
}

/**
 * Wrapper component that provides the InquiryProvider context.
 */
export default function InquiryWrapper() {
  // Navigation Hooks
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Search params.
  const preview = searchParams.get('preview') === 'true';

  if (!id) return null;
  return (
    <InquiryProvider id={id} preview={preview}>
      <Container>
        <UserInquiryPage />
      </Container>
    </InquiryProvider>
  );
}
