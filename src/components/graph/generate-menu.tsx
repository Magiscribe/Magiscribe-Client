import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faMagicWandSparkles, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import Button from '../controls/button';
import Input from '../controls/input';
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
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I help you modify your inquiry graph today?',
    sender: 'assistant',
  },
];

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
          sender === 'user'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white'
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
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
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
    // Provide a update callback to notify when new messages are added to the chat
    // beyond the initial messages.
    if (messages.length > INITIAL_MESSAGES.length) {
      onUpdate();
    }

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
      className="h-full bg-white dark:bg-slate-700 text-slate-800 dark:text-white absolute right-0 top-0 z-10 shadow-l-2xl flex flex-col border-l border-gray-200"
      ref={menuRef}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
        onMouseDown={handleMouseDown}
      />
      <div className="w-full h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Graph Editor</h2>
          <Button onClick={onClose} iconLeft={faTimes} variant="transparentSecondary" />
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} sender={message.sender} />
          ))}
          {generatingGraph && (
            <div className={`mb-4 flex justify-end`}>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-8" />
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Input
            value={inputMessage}
            name="message"
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleInputKeyDown}
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
