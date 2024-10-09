import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faMagicWandSparkles, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import Button from '../controls/button';
import MarkdownCustom from '../markdown-custom';

/**
 * Represents a chat message in the Graph Generator Menu.
 */
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
}

/**
 * Props for the Graph Generator Menu component.
 */
interface GraphGeneratorMenuProps {
  open: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

// Constants
const INITIAL_MENU_WIDTH = 400;
const MIN_MENU_WIDTH = 250;
const MAX_MENU_WIDTH = 1200;
const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Hello! How can I help you modify your inquiry graph today?',
  sender: 'assistant',
};

/**
 * ChatBubble component to render individual chat messages.
 * @param message The message to render.
 * @param sender The sender of the message.
 * @returns The ChatBubble component.
 */
function ChatBubble({ message, sender }: { message: Message; sender: 'user' | 'assistant' }) {
  return (
    <div className={`mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
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

/**
 * GraphGeneratorMenu component for managing and displaying the graph generation interface.
 */
export default function GraphGeneratorMenu({ open, onUpdate, onClose }: GraphGeneratorMenuProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [menuWidth, setMenuWidth] = useWithLocalStorage(INITIAL_MENU_WIDTH, 'playground-form');

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { generatingGraph, generateGraph, onGraphGenerationCompleted, onGraphGenerationStarted } = useInquiryBuilder();

  /*================================ EFFECTS ==============================*/

  useEffect(() => {
    onUpdate();
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  /*================================ HANDLERS ==============================*/

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const newWidth = menuRect.right - e.clientX;
      setMenuWidth(Math.max(MIN_MENU_WIDTH, Math.min(newWidth, MAX_MENU_WIDTH)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const sendMessage = (message: string, isUserMessage: boolean = true) => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: isUserMessage ? 'user' : 'assistant',
      };
      setMessages((prev) => [...prev, newMessage]);
      generateGraph(false, newMessage.text);
      setInputMessage('');
    }
  };

  const handleSendButtonClick = () => {
    sendMessage(inputMessage);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendButtonClick();
    }
  };

  /*================================ HELPERS ==============================*/

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  /*================================ SIDE EFFECTS ==============================*/

  onGraphGenerationStarted?.((message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
      },
    ]);
  });

  onGraphGenerationCompleted?.((message?: string) => {
    if (message) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message,
          sender: 'assistant',
        },
      ]);
    }
  });

  if (!open) {
    return null;
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ width: `${menuWidth}px` }}
      className="h-full bg-white absolute right-0 top-0 z-10 shadow-l-2xl flex flex-col border-l border-gray-200"
      ref={menuRef}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize bg-gray-300 hover:bg-gray-400"
        onMouseDown={handleMouseDown}
      />
      <div className="w-full h-full bg-white flex flex-col">
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
            onKeyDown={handleInputKeyDown}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Request a modification..."
          />
          <Button
            onClick={handleSendButtonClick}
            className="mt-2 w-full"
            disabled={generatingGraph || !inputMessage.trim()}
          >
            {generatingGraph ? 'Generating...' : 'Generate'}
            <FontAwesomeIcon
              className="ml-2"
              icon={generatingGraph ? faSpinner : faMagicWandSparkles}
              spin={generatingGraph}
            />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
