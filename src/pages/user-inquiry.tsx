import goHomeGif from '@/assets/imgs/go-home.gif';
import AnimatedDots from '@/components/animated/animated-dots';
import { ChartProps } from '@/components/chart';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import RatingInput from '@/components/graph/rating-input';
import { ImageLoader } from '@/components/image/image-load';
import MarkdownCustom from '@/components/markdown-custom';
import { useTranscribe } from '@/hooks/audio-hook';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useSetTitle } from '@/hooks/title-hook';
import { useAudioEnabled } from '@/providers/audio-provider';
import { useInquiry } from '@/providers/inquiry-traversal-provider';
import { ImageMetadata } from '@/types/conversation';
import { useQueue } from '@/utils/debounce-queue';
import { StrippedNode } from '@/utils/graphs/graph';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { faArrowUp, faChevronRight, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'text' | 'chart' | 'image';
  content: string | ChartProps | ImageMetadata[];
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
  // State
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('start');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Message Hooks
  const { messages, addMessage, isProcessing } = useMessageQueue();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Graph Hooks
  const { graph, preview, handleNextNode, form, state, onNodeUpdate, userDetails, setUserDetails } = useInquiry();

  // Audio Hooks
  const audio = useElevenLabsAudio(form.voice);
  const audioEnabled = useAudioEnabled();
  const { isTranscribing, transcript, handleTranscribe } = useTranscribe();

  // General Hooks
  const navigate = useNavigate();

  useSetTitle()(form?.title);

  /*================================ SIDE EFFECTS ==============================*/

  /**
   * Scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle transcription updates
  useEffect(() => {
    if (isTranscribing && transcript) {
      setInputMessage((prev) => prev + transcript);
    }
  }, [transcript, isTranscribing]);

  /**
   * Sets up the node visit callback once onNodeUpdate is available.
   */
  useEffect(() => {
    onNodeUpdate(onNodeVisit);
  }, [onNodeUpdate]);

  /*================================ HELPER FUNCTIONS ==============================*/

  /**
   * Validates the input based on the current node requirements.
   * @note This function currently only works for the start node, but can be expanded to other nodes in the future.
   * @param input { [key: string]: string } - The input object to validate
   * @returns { [key: string]: string } - An object containing the errors for each field
   */
  const validateInput = (input: { [key: string]: string }) => {
    const startNode = graph?.getCurrentNode();

    if (!startNode) return {};

    const requireNameCapture = (startNode?.data?.requireName as boolean) ?? false;
    const requireEmailCapture = (startNode?.data?.requireEmail as boolean) ?? false;

    const newErrors: { [key: string]: string } = {};

    if (requireNameCapture && !input.name) {
      newErrors.name = 'Please enter your name.';
    }

    if (requireEmailCapture && !input.email) {
      newErrors.email = 'Please enter your email address.';
    }

    if (input.email && !emailRegex.test(input.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    return newErrors;
  };

  /**
   * Handles the next node visit. This is called when the bot advances to the next node.
   */
  const onNodeVisit = useCallback(
    async (node: StrippedNode) => {
      if (node.type === 'end') {
        setScreen('end');
        return;
      }

      if (node.type === 'information' || node.type === 'question') {
        const messageText = node.data.text as string;
        setCurrentNode(node);

        if (audioEnabled && messageText) {
          audio.addSentence(messageText);
        }

        await addMessage({
          type: 'text',
          content: messageText,
          sender: 'bot',
        });

        if (node.data.images && (node.data.images as ImageMetadata[]).length > 0) {
          await addMessage({
            type: 'image',
            content: node.data.images as ImageMetadata[],
            sender: 'bot',
          });
        }

        if (node.type === 'information') {
          await handleNextNode();
        }
      }
    },
    [addMessage, audioEnabled, audio, handleNextNode],
  );

  /*================================ EVENT HANDLERS ==============================*/

  /**
   * A handler for input changes.
   * @param e { React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> } - The change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /**
   * Handles the start button click.
   */
  const handleStart = () => {
    const newErrors = validateInput(userDetails);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setScreen('inquiry');
      handleNextNode();
    }
  };

  /**
   * Handles the finish inquiry button click.
   */
  const handleFinishInquiry = () => {
    if (preview) {
      window.close();
    }
    setScreen('summary');
  };

  /**
   * Handles user message submission.
   * @param e { React.FormEvent } - The form event
   * @returns { Promise<void> } - A promise that resolves when the message is added
   */
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /*================================ RENDER FUNCTIONS ==============================*/

  const renderStartScreen = () => {
    const startNode = graph?.getCurrentNode();

    const requireNameCapture = (startNode?.data?.requireName as boolean) ?? false;
    const requireEmailCapture = (startNode?.data?.requireEmail as boolean) ?? false;
    const description = (startNode?.data?.text as string) ?? '';

    return (
      <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{form.title}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>
        <div className="space-y-4">
          {requireNameCapture && (
            <Input
              label="Name"
              name="name"
              placeholder="Your name"
              value={userDetails.name}
              onChange={handleChange}
              error={errors.name}
            />
          )}
          {requireEmailCapture && (
            <Input
              label="Email"
              name="email"
              placeholder="Your email address"
              value={userDetails.email}
              onChange={handleChange}
              error={errors.email}
            />
          )}
        </div>
        <button
          onClick={handleStart}
          className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 ease-in-out"
        >
          Get Started
        </button>
      </div>
    );
  };

  const renderMessages = () => (
    <>
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
              <ImageLoader images={message.content as ImageMetadata[]} />
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
    </>
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
            <div className="flex-grow flex items-center">
              <Button
                type="button"
                variant="transparentDark"
                size="small"
                onClick={handleTranscribe}
                iconLeft={isTranscribing ? faMicrophone : faMicrophoneSlash}
              ></Button>
              <Textarea
                name="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={1}
                className="resize-none overflow-hidden rounded-3xl flex-grow ml-2"
                onKeyDown={handleInputKeyDown}
              />
              <Button
                type="submit"
                className="absolute right-1 top-1.5 disabled:opacity-0 transition-opacity"
                disabled={state.loading || (inputMessage.trim() === '' && selectedRatings.length === 0)}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </Button>
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
