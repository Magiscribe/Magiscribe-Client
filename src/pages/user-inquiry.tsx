import AnimatedDots from '@/components/animated/animated-dots';
import Input from '@/components/controls/input';
import RatingInput from '@/components/graph/rating-input';
import MarkdownCustom from '@/components/markdown-custom';
import { useTranscribe } from '@/hooks/audio-hook';
import { useSetTitle } from '@/hooks/title-hook';
import { InquiryTraversalProvider, useInquiry } from '@/providers/inquiry-traversal-provider';
import { StrippedNode } from '@/utils/graphs/graph';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { faChevronRight, faCompress, faExpand, faImage, faMicrophone, faMicrophoneSlash, faMoon, faPaperPlane, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface Message {
  type: 'text' | 'chart' | 'image';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { preview, handleNextNode, form, state, onNodeUpdate, userDetails, setUserDetails } = useInquiry();

  useSetTitle()(form?.title);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTranscribing) {
      setInputMessage((current) => current + transcript);
    }
  }, [transcript]);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setMessages((prev) => [...prev, { type: 'image', content: imageUrl, sender: 'user' }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderHeader = () => (
    <motion.header
      className={`w-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} flex items-center justify-between shadow-md`}
      initial={false}
      animate={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex w-full p-4 max-w-4xl min-h-16 mx-auto items-center">
        <div className="flex items-center absolute left-4">
          <img src="https://avatar.iran.liara.run/public" alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {userDetails.name || 'User'}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Participant</p>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className={`text-xl font-bold mx-auto ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{form.title}</h1>
        </div>

        <div className="flex items-center absolute right-4">
          <button
            onClick={toggleDarkMode}
            className={`mr-4 ${isDarkMode ? 'text-white' : 'text-slate-800'} hover:text-purple-600`}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
        </div>
      </div>
    </motion.header>
  );

  const renderStartScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${isDarkMode ? 'bg-slate-700' : 'bg-white'} p-6 rounded-lg shadow-lg`}
    >
      <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{form.title}</h2>
      <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
        Please provide your details to get started.
      </p>
      <div className="space-y-4">
        <Input
          label="Name"
          name="name"
          placeholder="Your name"
          value={userDetails.name}
          onChange={handleChange}
          error={errors.name}
          className={`${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-800'} border-slate-300`}
        />
        <Input
          label="Email"
          name="email"
          placeholder="Your email address"
          value={userDetails.email}
          onChange={handleChange}
          error={errors.email}
          className={`${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-800'} border-slate-300`}
        />
      </div>
      <button
        onClick={handleStart}
        className="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 ease-in-out"
      >
        Get Started
      </button>
    </motion.div>
  );

  const renderMessages = () => (
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
          <div
            className={`max-w-[80%] p-3 rounded-3xl ${
              message.sender === 'user'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-200 text-slate-800'
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
    </AnimatePresence>
  );

  const renderInputArea = () => (
    <div className="w-full p-4 max-w-4xl mx-auto">
      {!state.loading && screen !== 'end' && ((currentNode?.data?.type ?? '') as string).startsWith('rating') && (
        <RatingInput
          ratings={currentNode.data.ratings as string[]}
          isMulti={currentNode.data.type === 'rating-multi'}
          onRatingChange={setSelectedRatings}
        />
      )}

      {screen === 'inquiry' && (
       <form onSubmit={handleSubmit} className="flex flex-col mt-4 relative">
       <div className="flex">
         <div className={`flex-grow flex items-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full`}>
           <button
             type="button"
             onClick={handleTranscribe}
             className={`py-3 px-5 text-slate-600 hover:text-slate-800 bg-purple-300 rounded-l-full transition-colors`}
           >
             <FontAwesomeIcon icon={isTranscribing ? faMicrophone : faMicrophoneSlash} />
           </button>
           <button
             type="button"
             onClick={() => fileInputRef.current?.click()}
             className={`py-3 px-5 text-slate-600 hover:text-slate-800 bg-purple-300 rounded-r-full transition-colors`}
           >
             <FontAwesomeIcon icon={faImage} />
           </button>
           <input
             type="text"
             value={inputMessage}
             onChange={(e) => setInputMessage(e.target.value)}
             placeholder="Type your message here..."
             className={`flex-grow p-3 bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-800'} border-transparent focus:border-transparent focus:ring-0`}
           />
           <button
             type="submit"
             className={`py-3 px-6 text-white bg-purple-600 hover:bg-purple-700 rounded-l-full rounded-r-full transition-colors ml-1`}
           >
             <FontAwesomeIcon icon={faPaperPlane} />
           </button>
         </div>
         <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
       </div>
       <p className="text-slate-400 text-sm mt-2 text-center">
         <i>Ocasionaly, mistakes may occur during the inquiry. If you notice any, please let us know.</i>
       </p>
     </form>
      )}

      {screen === 'end' && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleFinishInquiry}
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 ease-in-out"
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
      <div
        className={`h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Inquiry Not Found</h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            The inquiry you are looking for does not exist. Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div
        className={`h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
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
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {renderHeader()}
      <div className="w-full max-w-4xl flex-grow p-4 overflow-y-auto space-y-4 mx-auto">
        {screen === 'start' && renderStartScreen()}
        {renderMessages()}
        {state.loading && (
          <div className="flex justify-start items-center pt-4">
            <AnimatedDots />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {currentNode && currentNode.type !== 'end' && screen !== 'start' && renderInputArea()}
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
      <UserInquiryPage />
    </InquiryTraversalProvider>
  );
}
