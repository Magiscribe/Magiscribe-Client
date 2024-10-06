import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faMagicWandSparkles, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import Button from '../controls/button';
import MarkdownCustom from '../markdown-custom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

interface ChatWindowProps {
  onClose: () => void;
}

function ChatBubble({ message, sender }: { message: Message; sender: 'user' | 'assistant' }) {
  return (
    <div className={`mb-4 flex ${sender === 'user' ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[90%] p-3 rounded-lg ${
          sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-xs font-semibold mb-1">{sender === 'user' ? 'You' : 'Graph Editor'}</p>
        <MarkdownCustom>{message.text}</MarkdownCustom>
      </div>
    </div>
  );
}

export default function GraphGeneratorMenu({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you modify your inquiry graph today?',
      sender: 'assistant',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { generatingGraph, generateGraph, onGraphGenerated } = useInquiryBuilder();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  onGraphGenerated?.((message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: 'assistant',
      },
    ]);
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage('');
      generateGraph(inputMessage, false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 100, duration: 0.2 }}
      className="w-[40rem] h-full bg-white absolute -right-[15rem] top-0 z-10 shadow-2xl items-start flex flex-col border-l border-gray-200"
    >
      <div className="w-[25rem] h-full bg-white flex flex-col right-0 top-0 z-10">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Graph Editor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} sender={message.sender} />
          ))}
          {generatingGraph && (
            <div className={`mb-4 flex justify-end`}>
              <FontAwesomeIcon icon={faSpinner} className="text-gray-500 animate-spin mr-8" />
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <Button
            onClick={handleSendMessage}
            className="mt-2 w-full"
            disabled={generatingGraph || !inputMessage.trim()}
          >
            {generatingGraph ? 'Generating...' : 'Generate'}
            <FontAwesomeIcon icon={generatingGraph ? faSpinner : faMagicWandSparkles} className="ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
