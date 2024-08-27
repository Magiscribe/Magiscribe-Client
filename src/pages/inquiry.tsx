import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { ChartProps } from '@/components/chart';
import MarkdownCustom from '@/components/markdown-custom';
import RatingInput from '@/components/graph/rating-input';
import { InquiryProvider, useInquiry } from '@/providers/inquiry-provider';
import { StrippedNode, NodeData } from '@/utils/graphUtils';

interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

function InquiryContent() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeType, setCurrentNodeType] = useState<string | null>(null);
  const [currentRatings, setCurrentRatings] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [isEndNode, setIsEndNode] = useState(false);
  const { handleNextNode, loading, setOnUpdate } = useInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let responseData: { response: string; ratings?: string[] } = { response: inputMessage };

    if (selectedRatings.length > 0) {
      responseData.ratings = selectedRatings;
    }

    if (inputMessage.trim() !== '' || selectedRatings.length > 0) {
      const userMessage =
        selectedRatings.length > 0
          ? `${selectedRatings.join(', ')}${inputMessage ? ' - ' + inputMessage : ''}`
          : inputMessage;

      setMessages((prevMessages) => [...prevMessages, { type: 'text', content: userMessage, sender: 'user' }]);

      handleNextNode({ data: responseData });
      setInputMessage('');
      setSelectedRatings([]);
      setCurrentNodeType(null);
      setCurrentRatings([]);
    }
  };

  const onNodeVisit = (node: StrippedNode) => {
    if (node.type === 'information' || node.type === 'conversation') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'text', content: node.data.text as string, sender: 'bot' },
      ]);

      if (node.type === 'conversation') {
        const conversationData = node.data as NodeData & { type?: string; ratings?: string[] };
        if (conversationData.type === 'rating-single' || conversationData.type === 'rating-multi') {
          setCurrentNodeType(conversationData.type);
          setCurrentRatings(conversationData.ratings || []);
        } else {
          setCurrentNodeType(null);
          setCurrentRatings([]);
        }
      } else {
        setCurrentNodeType(null);
        setCurrentRatings([]);
      }
    }

    if (node.type === 'end') {
      setIsEndNode(true);
    } else if (node.type === 'information') {
      setTimeout(() => {
        handleNextNode();
      }, 1000);
    }
  };

  setOnUpdate(onNodeVisit);

  return (
    <div className="flex items-center justify-center max-w-4xl mx-auto p-4">
      <div className="container max-w-3xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Chat</h2>
        </div>
        <div className="flex-grow mb-4 rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={clsx('pt-4 flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
              <motion.div
                initial={{ opacity: 0, x: message.sender === 'user' ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={clsx(
                  'shadow-3xl max-w-[80%] p-2 rounded-lg',
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-300 text-gray-800',
                )}
              >
                <MarkdownCustom>{message.content as string}</MarkdownCustom>
              </motion.div>
            </div>
          ))}
        </div>
        {!isEndNode && (
          <>
            {currentNodeType && currentNodeType.startsWith('rating') && (
              <RatingInput
                ratings={currentRatings}
                isMulti={currentNodeType === 'rating-multi'}
                onRatingChange={setSelectedRatings}
              />
            )}
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Additional Thoughts (optional)"
                className={clsx(
                  'flex-grow p-2 border border-gray-300 rounded-l-lg text-black',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                )}
                disabled={loading}
              />
              <button
                type="submit"
                className={clsx(
                  'px-4 py-2 bg-blue-500 text-white rounded-r-lg',
                  'hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'disabled:bg-gray-400',
                )}
                disabled={loading || (selectedRatings.length === 0 && inputMessage.trim() === '')}
              >
                Send
                <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} spin={loading} className="ml-2" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Inquiry() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <></>;
  }

  return (
    <InquiryProvider id={id}>
      <InquiryContent />
    </InquiryProvider>
  );
}
