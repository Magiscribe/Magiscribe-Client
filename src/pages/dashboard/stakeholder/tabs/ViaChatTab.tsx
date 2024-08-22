import { ADD_PREDICTION } from '@/clients/mutations';
import { GET_ALL_AGENTS } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import Chart, { ChartProps } from '@/components/chart';
import MarkdownCustom from '@/components/markdown-custom';
import { TabProps } from '@/types/conversation';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

const ViaChatTab: React.FC<TabProps> = ({ data }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionId] = useState<string>(`advanced_analysis_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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
        const results = JSON.parse(prediction.result);
        handleAnalysisResults(results);
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      setLoading(false);
    },
  });

  const handleAnalysisResults = (results: string[]) => {
    results.forEach((result) => {
      try {
        const parsed = JSON.parse(result);
        if (parsed.chartType && Array.isArray(parsed.data)) {
          const chartProps: ChartProps = {
            title: parsed.title || '',
            chartType: parsed.chartType,
            data: parsed.data.map((item: { name: string; value: number }) => ({
              name: item.name,
              value: item.value,
            })),
          };
          const newChartMessage: Message = { type: 'chart', content: chartProps, sender: 'bot' };
          setMessages((prevMessages) => [...prevMessages, newChartMessage]);
        } else {
          throw new Error('Not a valid chart data');
        }
      } catch (error) {
        console.error('Error parsing result:', error);
        const newBotMessage: Message = { type: 'text', content: result, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      }
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = { type: 'text', content: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    let agentId;
    if (!agentsLoading && agents?.getAllAgents) {
      const chatAnalysisAgent = agents.getAllAgents.find(
        (agent: { id: string; name: string }) => agent.name === 'Stakeholder | Chat Analysis',
      );
      if (chatAnalysisAgent) {
        agentId = chatAnalysisAgent.id;
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
              conversationData: JSON.stringify(data.data),
              numResponses: data.data.nodeVisitData.length,
            },
          },
        });
      } catch (error) {
        console.error('Error sending message to agent:', error);
        setLoading(false);
      }
    } else {
      console.error('Chat Analysis Agent not found');
    }

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-grow overflow-auto mb-4 p-4 bg-white rounded-lg shadow">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'text' ? (
              <div
                className={`max-w-[80%] ${
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                } p-2 rounded-lg`}
              >
                <MarkdownCustom>{message.content as string}</MarkdownCustom>
              </div>
            ) : (
              <div className="w-full">
                <Chart {...(message.content as ChartProps)} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question about your data..."
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

export default ViaChatTab;
