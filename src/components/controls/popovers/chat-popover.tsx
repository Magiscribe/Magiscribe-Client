import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

import FixedPopover from './fixed-popover';

interface ChatPopoverProps {
  label: string;
}

export default function ChatPopover({ label }: ChatPopoverProps) {
    const [goals, setGoals] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'assistant' }[]>([]);
  const { generateGraph, generatingGraph, onGraphGenerated } = useInquiryBuilder();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGoals(e.target.value);
  };

  useEffect(() => {
    onGraphGenerated?.(() => {
        setMessages([...messages, { text: "Graph generated successfully!", sender: 'assistant' }]);
    });
  }, [open, onGraphGenerated]);

  const handleSendMessage = async () => {
    if (goals.trim()) {
      setMessages([...messages, { text: goals, sender: 'user' }]);
      setGoals('');

      generateGraph(false);
  };
}

  useEffect(() => {
    setMessages([{ text: "Hello! How can I help you modify your inquiry graph today?", sender: 'assistant' }]);
  }, []);

  return (
    <FixedPopover label={label}>
      <div className="h-full flex flex-col text-slate-800 ">
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {messages.map((message, index) => (
            <div key={index} className={`${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <textarea
            value={goals}
            onChange={handleInputChange}
            placeholder="Describe your graph modification goals..."
            rows={2}
            className="w-full p-2 border rounded-md resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSendMessage}
              disabled={generatingGraph || !goals.trim()}
              className="bg-blue-500 hover:bg-blue-700 text-sm font-bold py-2 px-4 rounded-full flex items-center disabled:opacity-50"
            >
              {generatingGraph ? (
                <>
                  Generating...
                  <FontAwesomeIcon icon={faSpinner} className="ml-2" spin />
                </>
              ) : (
                <>
                  Send
                  <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </FixedPopover>
  );
};