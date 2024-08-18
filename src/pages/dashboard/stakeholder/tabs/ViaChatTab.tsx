import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_ALL_AGENTS } from '../../../../clients/queries';
import { ADD_PREDICTION } from '../../../../clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '../../../../clients/subscriptions';
import Chart from '../../../../components/Chart';
import { Message, ChartData, AnalyzeViaChatProps } from '../../../../types/common';
import MarkdownCustom from '../../../../components/markdown-custom';

/**
 * Main component for analyzing data via chat interface
 * @param {Object} data - The data to be analyzed
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViaChatTab: React.FC<AnalyzeViaChatProps> = ({ data }: any) => {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionId] = useState<string>(`advanced_analysis_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: agents, loading: agentsLoading } = useQuery(GET_ALL_AGENTS);
  const [addPrediction] = useMutation(ADD_PREDICTION);

  /**
   * Scrolls to the bottom of the message list
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages]);

  // Subscribe to analysis results
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

  /**
   * Handles the analysis results received from the subscription
   * @param {string[]} results - The analysis results
   */
  const handleAnalysisResults = (results: string[]) => {
    results.forEach((result) => {
      try {
        const parsed = JSON.parse(result);
        if (parsed.chartType) {
          // Add chart data to messages
          const newChartMessage: Message = { type: 'chart', content: parsed, sender: 'bot' };
          setMessages((prevMessages) => [...prevMessages, newChartMessage]);
        }
      } catch (error) {
        // TODO: Chat about how to map different output types to different components.
        //       For now, if we can't parse it, we just show it as text.
        console.error('Error parsing result:', error);
        const newBotMessage: Message = { type: 'text', content: result, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      }
    });
  };

  /**
   * Handles sending a message to the analysis agent
   * @param {React.FormEvent} e - The form submit event
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message to the chat
    const newUserMessage: Message = { type: 'text', content: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Find the chat analysis agent
    let agentId;
    if (!agentsLoading && agents?.getAllAgents) {
      const chatAnalysisAgent = agents.getAllAgents.find(
        (agent: { id: string; name: string }) => agent.name === 'Stakeholder | Chat Analysis Level 1',
      );
      if (chatAnalysisAgent) {
        agentId = chatAnalysisAgent.id;
      }
    }

    if (agentId) {
      setLoading(true);
      try {
        console.log(inputMessage, data.data.data.length);
        // Send prediction request to the agent
        await addPrediction({
          variables: {
            subscriptionId,
            agentId,
            variables: {
              userMessage: inputMessage,
              conversationData: JSON.stringify(data.data),
              numResponses: data.data.data.length,
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

  /**
   * Renders a chart based on the provided chart data
   * @param {ChartData} chartData - The data for the chart
   * @returns {JSX.Element} The rendered Chart component
   */
  const renderChart = (chartData: ChartData) => {
    const { title, chartType, data } = chartData;
    return <Chart title={title} chartType={chartType} data={data} />;
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
              <div className="w-full">{renderChart(message.content as ChartData)}</div>
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
