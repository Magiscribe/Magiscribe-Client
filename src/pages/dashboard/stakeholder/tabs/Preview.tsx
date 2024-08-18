import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_DATA, GET_ALL_AGENTS } from '../../../../clients/queries';
import { ADD_PREDICTION } from '../../../../clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '../../../../clients/subscriptions';
import MarkdownCustom from '../../../../components/markdown-custom';

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

const PreviewTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionId] = useState<string>(`preview_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: formData, loading: formLoading } = useQuery(GET_DATA, {
    variables: { id },
    skip: !id,
  });

  const { data: agents, loading: agentsLoading } = useQuery(GET_ALL_AGENTS);
  const [addPrediction] = useMutation(ADD_PREDICTION);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS') {
        setLoading(false);
        const newBotMessage: Message = { content: prediction.result, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      setLoading(false);
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || formLoading || !formData) return;

    const newUserMessage: Message = { content: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    let agentId;
    if (!agentsLoading && agents?.getAllAgents) {
      const previewAgent = agents.getAllAgents.find(
        (agent: { id: string; name: string }) => agent.name === 'Stakeholder | Synthetic Data Generator Level 0',
      );
      if (previewAgent) {
        agentId = previewAgent.id;
      }
    }

    if (agentId) {
      setLoading(true);
      try {
        await addPrediction({
          variables: {
            subscriptionId,
            agentId,
            variables: {
              userMessage: inputMessage,
              conversationGraph: JSON.stringify(formData.dataObject.data.graph),
            },
          },
        });
      } catch (error) {
        console.error('Error sending message to agent:', error);
        setLoading(false);
      }
    } else {
      console.error('Preview Agent not found');
    }

    setInputMessage('');
  };

  if (formLoading) {
    return <div>Loading...</div>;
  }

  if (!formData) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-grow overflow-auto mb-4 p-4 bg-white rounded-lg shadow">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              } p-2 rounded-lg`}
            >
              <MarkdownCustom>{message.content}</MarkdownCustom>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter your response..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default PreviewTab;
