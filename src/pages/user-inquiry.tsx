import goHomeGif from '@/assets/imgs/end-inquiry.gif';
import AnimatedDots from '@/components/animated/animated-dots';
import { ChartProps } from '@/components/chart';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Textarea from '@/components/controls/textarea';
import RatingInput from '@/components/graph/rating-input';
import MarkdownCustom from '@/components/markdown-custom';
import { S3ImageLoader } from '@/components/s3-image-loader';
import { UserDataInput } from '@/graphql/graphql';
import { InquiryResponseUserDetails } from '@/graphql/types';
import { useTranscribe } from '@/hooks/audio-hook';
import useElevenLabsAudio from '@/hooks/audio-player';
import { useQueue } from '@/hooks/debounce-queue';
import { useSetTitle } from '@/hooks/title-hook';
import { useAddAlert } from '@/providers/alert-provider';
import { useAudioEnabled } from '@/providers/audio-provider';
import { useInquiry } from '@/providers/inquiry-traversal-provider';
import { ImageMetadata } from '@/types/conversation';
import { StrippedNode } from '@/utils/graphs/graph';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { faArrowUp, faChevronRight, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion, AnimatePresence } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInquiryResponseTime } from './hooks/inquiry-response-time';

interface Message {
  id: string;
  type: 'text' | 'chart' | 'image';
  content: string | ChartProps | ImageMetadata[];
  sender: 'user' | 'bot';
}

const emailRegex = /.+@.+\..+/;

/**
 * Loading quotes for different node types
 */
const getLoadingQuotes = (t: any) => ({
  INTEGRATION_LOADING_QUOTES: t('components.loadingQuotes.integration', { returnObjects: true }),
  QUESTION_LOADING_QUOTES: t('components.loadingQuotes.question', { returnObjects: true }),
  INFORMATION_LOADING_QUOTES: t('components.loadingQuotes.information', { returnObjects: true }),
  CONDITION_LOADING_QUOTES: t('components.loadingQuotes.condition', { returnObjects: true }),
});

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
    isQueueProcessing: queue.isProcessing,
    queueSize: queue.queueSize,
  };
};

export default function UserInquiryPage() {
  // Hooks
  const { t } = useTranslation();
  // State
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('start');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentLoadingQuote, setCurrentLoadingQuote] = useState('');
  const { primaryEmailAddress, firstName } = useUserInfoFromUrl();
  const expectedInquiryResponseTime = useInquiryResponseTime();

  // Message Hooks
  const { messages, addMessage, isQueueProcessing: isProcessing } = useMessageQueue();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Graph Hooks
  const { graph, preview, handleNextNode, settings, state, onNodeUpdate, onNodeError, userDetails, setUserDetails } =
    useInquiry();

  // Audio Hooks
  const audio = useElevenLabsAudio(settings.voice);
  const audioEnabled = useAudioEnabled();
  const { isTranscribing, transcript, handleTranscribe } = useTranscribe();

  // Alerts
  const addAlert = useAddAlert();

  useSetTitle()(settings?.title);

  /*================================ SIDE EFFECTS ==============================*/

  /**
   * Rotate loading quotes every 3 seconds when loading
   */
  useEffect(() => {
    if (state.loading) {
      // Get appropriate loading quotes based on current node type and loading state
      let quotes: string[] = [];
      const loadingQuotes = getLoadingQuotes(t);

      if (currentNode) {
        const nodeType = currentNode.type;
        console.log(
          'Loading quotes - Node type:',
          nodeType,
          'Loading:',
          state.loading,
          'Dynamic generation:',
          currentNode.data?.dynamicGeneration,
        );

        // Check if it's dynamic generation (question or information with dynamic generation)
        if (currentNode.data?.dynamicGeneration) {
          if (nodeType === 'question') quotes = loadingQuotes.QUESTION_LOADING_QUOTES;
          else if (nodeType === 'information') quotes = loadingQuotes.INFORMATION_LOADING_QUOTES;
        }

        // Check specific node types
        if (quotes.length === 0) {
          if (nodeType === 'condition') quotes = loadingQuotes.CONDITION_LOADING_QUOTES;
          else if (nodeType === 'integration') quotes = loadingQuotes.INTEGRATION_LOADING_QUOTES;
        }
      } else {
        // If we don't have a current node yet (initial loading), show generic loading quotes
        console.log('Loading quotes - No current node yet, showing generic loading quotes');
      }

      // Default fallback (also used when currentNode is null)
      if (quotes.length === 0) {
        quotes = [t('common.labels.loading'), 'Please wait while we work our magic...', 'Almost there...'];
      }

      console.log('Selected quotes array:', quotes);

      if (quotes.length > 0) {
        // Set initial quote
        setCurrentLoadingQuote(quotes[0]);
        console.log('Set initial loading quote:', quotes[0]);

        // Rotate quotes every 3 seconds
        const interval = setInterval(() => {
          const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
          setCurrentLoadingQuote(newQuote);
          console.log('Rotated to quote:', newQuote);
        }, 3000);

        return () => clearInterval(interval);
      }
    } else {
      // Clear loading quote when not loading
      setCurrentLoadingQuote('');
      console.log('Cleared loading quote - Loading:', state.loading, 'Current node:', currentNode?.type);
    }
  }, [state.loading, currentNode]);

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

  /**
   * Handles errors from the graph.
   */
  useEffect(() => {
    onNodeError(onError);
  }, [onNodeError]);

  /*================================ HELPER FUNCTIONS ==============================*/

  /**
   * Validates the input based on the current node requirements.
   * @note This function currently only works for the start node, but can be expanded to other nodes in the future.
   * @param input { [key: string]: string } - The input object to validate
   * @returns { [key: string]: string } - An object containing the errors for each field
   */
  const validateInput = (input: InquiryResponseUserDetails) => {
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
      // Always set the current node for loading quote purposes
      setCurrentNode(node);

      if (node.type === 'end') {
        setScreen('end');
        return;
      }

      if (node.type === 'information' || node.type === 'question') {
        const messageText = node.data.text as string;

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

  const onError = (error: Error) => {
    addAlert(error.message || 'An error occurred while processing the inquiry. Please try again later.', 'warning');
  };

  /*================================ EVENT HANDLERS ==============================*/

  /**
   * A handler for input changes.
   * @param e { React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> } - The change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const inputValue = type === 'checkbox' ? checked : value;

    setUserDetails((prev) => ({ ...prev, [name]: inputValue }));
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
    if (state.loading) return;
    if (isProcessing) return;

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
      <div className="bg-white dark:bg-slate-700 p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{settings.title}</h2>
        {expectedInquiryResponseTime && (
          <p className="text-slate-600 dark:text-slate-300 mb-6">{t('pages.userInquiry.estimatedTime', { time: expectedInquiryResponseTime })}</p>
        )}
        <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>
        <div className="space-y-4">
          {requireNameCapture && !firstName && (
            <Input
              label="Name"
              name="name"
              placeholder="Your name"
              value={userDetails.name ?? ''}
              onChange={handleChange}
              error={errors.name}
            />
          )}
          {requireEmailCapture && !primaryEmailAddress && (
            <Input
              label="Email"
              name="email"
              placeholder="Your email address"
              value={userDetails.email ?? ''}
              onChange={handleChange}
              error={errors.email}
            />
          )}
          {requireEmailCapture && (
            <Input
              label={t('pages.userInquiry.receiveEmailCopy')}
              name="recieveEmails"
              type="checkbox"
              value={String(userDetails.recieveEmails ?? 'false')}
              onChange={handleChange}
            />
          )}
        </div>
        <Button onClick={handleStart} className="mt-4 w-full">
          Get Started
        </Button>
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
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white'
            }`}
          >
            {message.type === 'image' ? (
              <S3ImageLoader images={message.content as ImageMetadata[]} />
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
          {state.loading && currentLoadingQuote && (
            <AnimatePresence mode="wait">
              <motion.p
                key={currentLoadingQuote}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-sm italic text-slate-500 dark:text-slate-400 ml-3 -mt-6 max-w-[80%]"
              >
                {currentLoadingQuote}
              </motion.p>
            </AnimatePresence>
          )}
        </div>
      )}
    </>
  );

  const renderSummary = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white text-center">{t('pages.userInquiry.thankYou')}</h2>
      <p className="text-lg text-slate-600 dark:text-slate-300 text-center">{t('pages.userInquiry.responsesRecorded')}</p>

      <img src={goHomeGif} alt={t('pages.userInquiry.thankYou')} className="mx-auto rounded-3xl mt-4" />
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Form */}
        <p className="text-center text-slate-600 dark:text-slate-400 mt-4">
          {t('pages.userInquiry.makeOwnInquiry')}{' '}
          <SignedOut>
            <SignUpButton signInForceRedirectUrl="/dashboard" forceRedirectUrl="/dashboard">
              <button className="underline dark:text-white text-slate-800 hover:text-purple-600 transition-colors">
                {t('pages.userInquiry.signUpFree')}
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="underline dark:text-white text-slate-800 hover:text-purple-600 transition-colors"
            >
              {t('pages.userInquiry.goToBuilder')}
            </Link>
          </SignedIn>
        </p>
      </div>
    </div>
  );

  const renderInputArea = () => (
    <div className="w-full p-4 max-w-4xl mx-auto">
      {screen === 'inquiry' && (
        <>
          {currentNode && !state.loading && ((currentNode?.data?.type ?? '') as string).endsWith('-select') && (
            <RatingInput
              ratings={(currentNode.data.ratings as string[]) ?? []}
              isMulti={currentNode.data.type === 'multi-select'}
              onRatingChange={setSelectedRatings}
            />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col mt-4 relative">
            <motion.div
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative grow flex items-center">
                <Textarea
                  value={inputMessage}
                  name="message"
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  onKeyDown={handleInputKeyDown}
                  rows={1}
                  className="rounded-3xl resize-none pb-12 pr-16 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                  style={{
                    overflow: inputMessage.split('\n').length <= 3 ? 'hidden' : 'auto',
                  }}
                />
                <Button
                  type="button"
                  variant="transparentDark"
                  className="absolute left-2 bottom-1.5"
                  onClick={handleTranscribe}
                >
                  <FontAwesomeIcon className="" icon={isTranscribing ? faMicrophone : faMicrophoneSlash} />
                </Button>
                <Button
                  type="submit"
                  className="absolute right-3 bottom-1.5"
                  disabled={state.loading || (inputMessage.trim() === '' && selectedRatings.length === 0)}
                >
                  <FontAwesomeIcon className="" icon={faArrowUp} />
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
            </motion.div>
            <motion.p
              className="text-slate-500 text-sm mt-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <i>
                {t('pages.userInquiry.disclaimer')}{' '}
                <a href={`mailto:${t('emails.support')}`} className="underline">
                  {t('emails.support')}
                </a>
                .
              </i>
            </motion.p>
          </form>
        </>
      )}

      {screen === 'end' && (
        <>
          <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-800" />
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={handleFinishInquiry}>
              Finish
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <AnimatedDots />
      <p className="text-slate-600 dark:text-slate-300 mt-4">{t('pages.userInquiry.loadingInquiry')}</p>
    </div>
  );

  const renderNotFound = () => (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{t('pages.userInquiry.inquiryNotFound')}</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {t('pages.userInquiry.inquiryNotFoundDescription')}
      </p>
    </div>
  );

  const renderError = () => (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{t('pages.userInquiry.somethingWentWrong')}</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {t('pages.userInquiry.errorDescription')}
      </p>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {t('pages.userInquiry.errorPersists')}{' '}
        <a href={`mailto:${t('emails.support')}`} className="underline">
          {t('emails.support')}
        </a>
        .
      </p>
    </div>
  );

  const getActiveScreen = () => {
    if (state.loading && !state.initialized) return renderLoading();
    if (state.error) return renderError();
    if (state.notFound) return renderNotFound();

    switch (screen) {
      case 'start':
        return renderStartScreen();
      case 'inquiry':
      case 'end':
        return renderMessages();
      case 'summary':
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl grow p-4 space-y-4 mx-auto">{getActiveScreen()}</div>
      {(screen === 'inquiry' || screen === 'end') && !state.error && renderInputArea()}
    </>
  );
}

function useUserInfoFromUrl(): UserDataInput {
  const { setUserDetails } = useInquiry();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');

  React.useEffect(() => {
    if (email || name) {
      setUserDetails({
        email,
        name,
      });
    }
  }, [name, email]);

  return {
    primaryEmailAddress: email ?? '',
    firstName: name ?? '',
  };
}
