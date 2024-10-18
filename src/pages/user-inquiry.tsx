import AnimatedDots from '@/components/animated/animated-dots';
import { ChartProps } from '@/components/chart';
import Input from '@/components/controls/input';
import RatingInput from '@/components/graph/rating-input';
import MarkdownCustom from '@/components/markdown-custom';
import { useTranscribe } from '@/hooks/audio-hook';
import { useSetTitle } from '@/hooks/title-hook';
import { InquiryTraversalProvider, useInquiry } from '@/providers/inquiry-traversal-provider';
import { StrippedNode } from '@/utils/graphs/graph';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { faChevronRight, faCompress, faEllipsisV, faExpand, faMicrophone, faMicrophoneSlash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

const emailRegex = /.+@.+\..+/;

function UserInquiryPage() {
  const [screen, setScreen] = useState<'start' | 'inquiry' | 'end' | 'summary'>('start');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<StrippedNode | null>(null);
  const { isTranscribing, transcript, handleTranscribe } = useTranscribe();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { preview, handleNextNode, form, state, onNodeUpdate, userDetails, setUserDetails } = useInquiry();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

  const onNodeVisit = async (node: StrippedNode) => {
    if (node.type === 'end') {
      setScreen('end');
      return;
    }

    if (node.type === 'information' || node.type === 'question') {
      setMessages((prev) => [...prev, { type: 'text', content: node.data.text as string, sender: 'bot' }]);
      setCurrentNode(node);

      if (node.type === 'information') {
        await handleNextNode();
      }
    }
  };

  useEffect(() => {
    if (isTranscribing) {
      setInputMessage((current) => current + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    onNodeUpdate(onNodeVisit);
  }, [onNodeUpdate]);

  useSetTitle()(form?.title);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  if (state.notFound) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Inquiry Not Found</h2>
          <p className="text-gray-400">The inquiry you are looking for does not exist. Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-gray-400 mb-4">Looks like something broke on our end. Your previous answers have been recorded.</p>
          <button onClick={() => navigate(0)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Restart Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex items-center">
      <header className="w-full bg-gray-800 flex items-center justify-between">
        <div className="flex w-full  p-4 max-w-4xl mx-auto">
          <img src='https://avatar.iran.liara.run/public' alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h1 className="font-bold">{form.title}</h1>
            <p className="text-sm text-gray-400">We're here to help</p>
          </div>
        <div className="ml-auto flex items-center">
          <button onClick={toggleFullScreen} className="text-gray-400 hover:text-white mr-4">
            <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} />
          </button>
        </div>
        </div>
      </header>

      <div className="w-full max-w-4xl flex-grow p-4 overflow-y-auto space-y-4">
        {screen === 'start' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Welcome to our inquiry!</h2>
            <p className="text-gray-400 mb-6">Please provide your details to get started.</p>
            <div className="space-y-4">
              <Input
                label="Name"
                name="name"
                placeholder="Your name"
                value={userDetails.name}
                onChange={handleChange}
                error={errors.name}
                className="bg-gray-700 text-white border-gray-600"
              />
              <Input
                label="Email"
                name="email"
                placeholder="Your email address"
                value={userDetails.email}
                onChange={handleChange}
                error={errors.email}
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
            <button
              onClick={handleStart}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Start Inquiry
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}>
                <MarkdownCustom>{message.content as string}</MarkdownCustom>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {state.loading && (
          <div className="flex justify-start items-center pt-4">
            <AnimatedDots />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {currentNode && currentNode.type !== 'end' && screen !== 'start' && (
        <div className="w-full  p-4 max-w-4xl mx-auto">
          {!state.loading && screen !== 'end' && ((currentNode.data?.type ?? '') as string).startsWith('rating') && (
            <RatingInput
              ratings={currentNode.data.ratings as string[]}
              isMulti={currentNode.data.type === 'rating-multi'}
              onRatingChange={setSelectedRatings}
            />
          )}

          {screen === 'inquiry' && (
            <form onSubmit={handleSubmit} className="flex mt-4">
              <div className="flex-grow flex items-center bg-gray-800 rounded-full">
                <button
                  type="button"
                  onClick={handleTranscribe}
                  className="p-3 text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={isTranscribing ? faMicrophone : faMicrophoneSlash} />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-grow p-3 bg-transparent text-white rounded-r-full"
                />
              </div>
            </form>
          )}

          {screen === 'end' && (
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleFinishInquiry}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Finish Inquiry
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InquiryWrapper() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get('preview') === 'true';

  if (!id) return null;
  return (
    <InquiryTraversalProvider id={id} preview={preview}>
      <div className="w-full h-screen bg-gray-900 text-white overflow-hidden">
      <UserInquiryPage />
  </div>
    </InquiryTraversalProvider>
  );
}