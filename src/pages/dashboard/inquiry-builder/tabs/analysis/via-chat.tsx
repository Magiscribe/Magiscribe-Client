import { ADD_PREDICTION } from '@/clients/mutations';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import Chart, { ChartProps } from '@/components/chart';
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import MarkdownCustom from '@/components/markdown-custom';
import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import { TabProps } from '@/types/conversation';
import { getAgentIdByName } from '@/utils/agents';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
import { faPaperPlane, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

export default function ViaChatTab({ data }: TabProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionId] = useState<string>(`advanced_analysis_${Date.now()}`);
  const [messages, setMessages] = useWithLocalStorage<Message[]>([], `${data.id}-chat`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const client = useApolloClient();
  const [addPrediction] = useMutation(ADD_PREDICTION);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: { subscriptionId },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;
      if (prediction && prediction.type === 'SUCCESS') {
        setLoading(false);
        parseAndDisplayAnalysisResults(JSON.parse(prediction.result));
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      setLoading(false);
    },
  });

  const parseAndDisplayAnalysisResults = (result: string[]) => {
    if (result.length === 0) {
      console.error('Result array is empty');
      return;
    }

    const content = result[0];
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    const markdownMatch = content.match(/```markdown\n([\s\S]*?)\n```/);

    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[1]);
      if (parsedResult.chartType && Array.isArray(parsedResult.data)) {
        const chartProps: ChartProps = {
          title: parsedResult.title || '',
          chartType: parsedResult.chartType,
          data: parsedResult.data.map((item: { name: string; value: number }) => ({
            name: item.name,
            value: item.value,
          })),
          fullWidth: true,
        };
        setMessages((prevMessages) => [...prevMessages, { type: 'chart', content: chartProps, sender: 'bot' }]);
      }
    }

    if (markdownMatch) {
      setMessages((prevMessages) => [...prevMessages, { type: 'text', content: markdownMatch[1], sender: 'bot' }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    setMessages((prevMessages) => [...prevMessages, { type: 'text', content: inputMessage, sender: 'user' }]);
    setInputMessage('');

    const agentId = await getAgentIdByName('Chat Analysis', client);
    if (agentId) {
      setLoading(true);
      try {
        await addPrediction({
          variables: {
            subscriptionId,
            agentId,
            variables: {
              userMessage: inputMessage,
              conversationData: JSON.stringify(data),
              numResponses: data.responses?.length ?? 0,
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
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  if (!data.responses) return <div className="p-4 text-slate-700 dark:text-white">No data available</div>;

  return (
    <div className="bg-white dark:bg-slate-700 px-4 py-8 rounded-2xl shadow-xl text-slate-700 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chat</h2>
        <Button onClick={handleClearChat} variant="danger" iconLeft={faTrash}>
          Clear
        </Button>
      </div>
      <div className="flex-grow mb-4 rounded-lg overflow-y-auto max-h-[60vh]">
        {messages.map((message, index) => (
          <div key={index} className={clsx('pt-4 flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
            <motion.div
              initial={{ opacity: 0, x: message.sender === 'user' ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={clsx(
                'shadow-3xl p-2 rounded-lg',
                message.type === 'chart' ? 'w-full max-w-[80%]' : 'max-w-[80%]',
                message.sender === 'user'
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white',
              )}
            >
              {message.type === 'text' ? (
                <MarkdownCustom>{message.content as string}</MarkdownCustom>
              ) : (
                <div className="w-full">
                  <Chart {...(message.content as ChartProps)} />
                </div>
              )}
            </motion.div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <Input
          name="message"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question about your data..."
          disabled={loading}
          className={clsx('rounded-r-none', 'flex-grow')}
        />
        <Button type="submit" className={clsx('rounded-l-none')} disabled={loading}>
          Send
          <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} spin={loading} className="ml-2" />
        </Button>
      </form>
    </div>
  );
}
