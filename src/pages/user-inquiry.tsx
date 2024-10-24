import goHomeGif from '@/assets/imgs/go-home.gif';
import AnimatedDots from '@/components/animated/animated-dots';
import { ChartProps } from '@/components/chart';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import RatingInput from '@/components/graph/rating-input';
import MarkdownCustom from '@/components/markdown-custom';
import { useTranscribe } from '@/hooks/audio-hook';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { useSetTitle } from '@/hooks/title-hook';
import { useInquiry } from '@/providers/inquiry-traversal-provider';
import { useQueue } from '@/utils/debounce-queue';
import { StrippedNode } from '@/utils/graphs/graph';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import {
  faChevronRight,
  faImage,
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
  type: 'text' | 'chart' | 'image';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

const emailRegex = /.+@.+\..+/;

export const useMessageQueue = () => {
  const calculateMessageDelay = (message: Message): number => {
    if (message.sender !== 'bot' || message.type !== 'text') return 0;
    const content = message.content as string;
    return content.length * 5; // 5ms per character
  };

  const shouldProcessImmediately = (message: Message): boolean => {
    return message.sender === 'user';
  };

  const queue = useQueue<Message>({
    processDelay: calculateMessageDelay,
    minDelay: 500,
    maxDelay: 3000,
    shouldProcessImmediately,
  });

  return {
    messages: queue.items,
    addMessage: queue.addItem,
    isProcessing: queue.isProcessing,
    queueSize: queue.queueSize,
  };
};

export default function UserInquiryPage() {
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('start');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { messages, addMessage, isProcessing } = useMessageQueue();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isTranscribing, transcript, handleTranscribe } = useTranscribe();
  const { preview, handleNextNode, form, state, onNodeUpdate, userDetails, setUserDetails } = useInquiry();
  const [enableAudio, setEnableAudio] = useWithLocalStorage(false, 'enableAudio');
  const audio = useElevenLabsAudio(form.voice);
  const navigate = useNavigate();

  useSetTitle()(form?.title);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle transcription updates
  useEffect(() => {
    if (isTranscribing && transcript) {
      setInputMessage((prev) => prev + transcript);
    }
  }, [transcript, isTranscribing]);

  useEffect(() => {
    onNodeUpdate(onNodeVisit);
  }, [onNodeUpdate]);

  const validateInput = (input: { [key: string]: string }) => {
    const newErrors: { [key: string]: string } = {};
    if (input.email && !emailRegex.test(input.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleStart = () => {
    const newErrors = validateInput(userDetails);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setScreen('inquiry');
      handleNextNode();
    }
  };

  const handleFinishInquiry = () => {
    if (preview) {
      window.close();
    }
    setScreen('summary');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' && selectedRatings.length === 0) return;

    const userMessage = [...selectedRatings, inputMessage.trim()].filter(Boolean).join(' - ');

    handleNextNode({
      data: {
        text: inputMessage,
        ...(selectedRatings.length > 0 && { ratings: selectedRatings }),
      },
    });

    await addMessage({
      type: 'text',
      content: userMessage,
      sender: 'user',
    });

    setInputMessage('');
    setSelectedRatings([]);
  };

  const onNodeVisit = useCallback(
    async (node: StrippedNode) => {
      if (node.type === 'end') {
        setScreen('end');
        return;
      }

      if (node.type === 'information' || node.type === 'question') {
        const messageText = node.data.text as string;
        setCurrentNode(node);

        if (enableAudio && messageText) {
          audio.addSentence(messageText);
        }

        await addMessage({
          type: 'text',
          content: messageText,
          sender: 'bot',
        });

        if (node.type === 'information') {
          await handleNextNode();
        }
      }
    },
    [addMessage, enableAudio, audio, handleNextNode],
  );

  const renderStartScreen = () => (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{form.title}</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Please provide your details to get started.</p>
      <div className="space-y-4">
        <Input
          label="Name"
          name="name"
          placeholder="Your name"
          value={userDetails.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          placeholder="Your email address"
          value={userDetails.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Textarea
          label="Tell us about yourself"
          name="about"
          placeholder="Your background, interests, or anything you'd like to share."
          value={userDetails.about}
          error={errors.about}
        />
      </div>
      <button
        onClick={handleStart}
        className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 ease-in-out"
      >
        Get Started
      </button>
    </div>
  );

  const renderMessages = () => (
    <AnimatePresence>
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-3xl ${
              message.sender === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white'
            }`}
          >
            {message.type === 'image' ? (
              <img src={message.content as string} alt="User uploaded" className="max-w-full h-auto rounded" />
            ) : (
              <MarkdownCustom>{message.content as string}</MarkdownCustom>
            )}
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />

      {(state.loading || isProcessing) && (
        <div className="flex justify-start items-center pt-4">
          <AnimatedDots />
        </div>
      )}
    </AnimatePresence>
  );

  const renderSummary = () => (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white text-center">Thank you!</h2>
      <p className="text-lg text-slate-600 dark:text-slate-300 text-center">Your responses have been recorded.</p>

      <img src={goHomeGif} alt="Thank You" className="mx-auto rounded-3xl mt-4" />
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Form */}
        <p className="text-center text-slate-600 dark:text-slate-400 mt-4">
          Want to make your own inquiry?{' '}
          <SignedOut>
            <SignUpButton signInForceRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
              <button className="underline dark:text-white text-slate-800 hover:text-purple-600 transition-colors">
                Sign up for free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard/inquiry-builder"
              className="underline dark:text-white text-slate-800 hover:text-purple-600 transition-colors"
            >
              Go to Graph Builder
            </Link>
          </SignedIn>
        </p>
      </div>
    </div>
  );

  const renderInputArea = () => (
    <div className="w-full p-4 max-w-4xl mx-auto">
      {currentNode &&
        !state.loading &&
        screen !== 'end' &&
        ((currentNode?.data?.type ?? '') as string).startsWith('rating') && (
          <RatingInput
            ratings={currentNode.data.ratings as string[]}
            isMulti={currentNode.data.type === 'rating-multi'}
            onRatingChange={setSelectedRatings}
          />
        )}

      {screen === 'inquiry' && (
        <form onSubmit={handleSubmit} className="flex flex-col mt-4 relative">
          <motion.div
            className="flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-grow flex items-center bg-slate-200 dark:bg-slate-700 rounded-full">
              <button
                type="button"
                onClick={handleTranscribe}
                className="py-3 px-5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-500 rounded-l-full transition-colors"
              >
                <FontAwesomeIcon icon={isTranscribing ? faMicrophone : faMicrophoneSlash} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-500 rounded-r-full transition-colors"
              >
                <FontAwesomeIcon icon={faImage} />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow p-3 bg-transparent text-slate-800 dark:text-white border-transparent focus:border-transparent focus:ring-0"
              />
              <button
                type="submit"
                className="py-3 px-6 text-white bg-purple-600 hover:bg-purple-700 rounded-l-full rounded-r-full transition-colors ml-1"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </motion.div>
          <motion.p
            className="text-slate-400 text-sm mt-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <i>Occasionally, mistakes may occur during the inquiry. If you notice any, please let us know.</i>
          </motion.p>
        </form>
      )}

      {screen === 'end' && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleFinishInquiry}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition duration-300 ease-in-out"
          >
            Finish Inquiry
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  if (state.notFound) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Inquiry Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400">
            The inquiry you are looking for does not exist. Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Looks like something broke on our end. Your previous answers have been recorded.
          </p>
          <button
            onClick={() => navigate(0)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Restart Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl flex-grow p-4 overflow-y-auto space-y-4 mx-auto">
        {screen === 'start' && renderStartScreen()}
        {(screen === 'inquiry' || screen === 'end') && renderMessages()}
        {screen === 'summary' && renderSummary()}
        <div ref={messagesEndRef} />
      </div>
      {currentNode && currentNode.type !== 'end' && screen !== 'start' && renderInputArea()}
    </>
  );
}
