import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

interface Message {
  id: number;
  type: string;
  content: string | HTMLImageElement;
  contentType: 'text' | 'image';
}

const defaultMessages: Message[] = [
  { id: 1, type: 'bot', content: "Hello! I'm a bot. How can I help you today?", contentType: 'text' },
];

const InquiryPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [allMessagesRendered, setAllMessagesRendered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentMessageIndex < defaultMessages.length) {
        setMessages((prev) => [...prev, defaultMessages[currentMessageIndex]]);
        setCurrentMessageIndex((prev) => prev + 1);
      } else {
        clearInterval(timer);
        setAllMessagesRendered(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMessageIndex]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { id: Date.now(), type: 'user', content: input, contentType: 'text' }]);
      setInput('');
    }
  };

  return (
    <div className="flex items-center justify-center max-w-4xl mx-auto p-4">
      <div className="flex flex-col w-full h-full text-white">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            className={`mb-4 ${index < messages.length - 1 ? 'filter opacity-70' : ''}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            <div
              className={`p-3 rounded-3xl max-w-[80%] ${message.type === 'user' ? 'ml-auto text-white bg-slate-800' : ''}`}
            >
              {message.contentType === 'text' ? (
                <Markdown>{message.content as string}</Markdown>
              ) : (
                <img src={message.content as string} alt="User drawing" className="max-w-full h-auto bg-slate-100" />
              )}
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {allMessagesRendered && (
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow p-2 rounded-l-3xl bg-slate-50 bg-slate-100 text-black focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-slate-400 hover:bg-slate-500 p-2 text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InquiryPage;
