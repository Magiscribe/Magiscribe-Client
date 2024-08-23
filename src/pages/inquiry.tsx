import { ADD_PREDICTION } from '@/clients/mutations';
import { GET_ALL_AGENTS, GET_DATA } from '@/clients/queries';
import { GRAPHQL_SUBSCRIPTION } from '@/clients/subscriptions';
import { ChartProps } from '@/components/chart';
import MarkdownCustom from '@/components/markdown-custom';
import { useAddAlert } from '@/providers/AlertProvider';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Edge, Node } from '@xyflow/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  type: 'text' | 'chart';
  content: string | ChartProps;
  sender: 'user' | 'bot';
}

export default function Inquiry() {
  // State
  const visitedNodes = useRef<{ id: string; data: { text: string } | undefined }[]>([]);
  const currentNode = useRef<Node | undefined | null>(null);
  const graph = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionId] = useState<string>(`advanced_analysis_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([]);

  // Hooks
  const { id } = useParams<{ id: string }>();
  const alerts = useAddAlert();

  useEffect(() => {
    console.log('State:', {
      currentNode,
      graph,
      visitedNodes,
    });
  }, [currentNode]);

  // Queries and Mutations
  const { data: agents } = useQuery(GET_ALL_AGENTS);
  const [addPrediction] = useMutation(ADD_PREDICTION);
  useQuery(GET_DATA, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onCompleted: ({ dataObject }) => {
      if (dataObject.data.graph) {
        graph.current = dataObject.data.graph;
        currentNode.current = dataObject.data.graph.nodes.find((node: Node) => node.type === 'start');
        handleNextNode();
      }
    },
    onError: () => {
      alerts('Something went wrong', 'error');
      console.log('error');
    },
  });

  useSubscription(GRAPHQL_SUBSCRIPTION, {
    variables: {
      subscriptionId,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const prediction = subscriptionData.data?.predictionAdded;

      if (prediction && prediction.type === 'SUCCESS') {
        setLoading(false);
        const result = JSON.parse(JSON.parse(prediction.result));
        console.log('Result:', result);
        handleNextNode({
          nextNodeId: result.nextNodeId,
          data: result,
        });
      }
    },
    onError: () => {
      setLoading(false);
    },
  });

  interface handleNextNodeProps {
    nextNodeId?: string;
    data?: any;
    callback?: () => void;
  }

  const handleNextNode = async ({ nextNodeId, data, callback }: handleNextNodeProps = {}) => {
    console.log('nextNodeId', nextNodeId);
    console.log('We are at:', currentNode.current);

    // Get the edges that are connected to the current node as source
    const edges = graph.current.edges.filter((edge) => edge.source == currentNode.current?.id);

    // Move to the next node
    let edge;
    if (nextNodeId) {
      edge = edges.find((edge) => edge.target === nextNodeId);
    } else {
      edge = edges[0];
    }
    if (!edge) {
      return;
    }

    const nextNode = graph.current.nodes.find((node) => node.id === edge.target);
    if (!nextNode) {
      return;
    }

    visitedNodes.current.push({
      id: currentNode.current!.id,
      data: inputMessage
        ? {
            text: inputMessage,
          }
        : undefined,
    });
    currentNode.current = nextNode;
    if (callback) {
      callback();
    }

    console.log('We are now at:', currentNode.current);

    // Condition 1 - Information
    if (nextNode.type === 'information') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'text', content: nextNode.data.text as any, sender: 'bot' },
      ]);
      handleNextNode();
    }

    // Condition 2 - Conversation
    if (nextNode.type === 'conversation') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'text', content: nextNode.data.text as any, sender: 'bot' },
      ]);
    }

    // Condition 3 - Condition
    if (nextNode.type === 'condition') {
      const conditionAgent = agents.getAllAgents.find(
        (agent: { id: string; name: string }) => agent.name === 'Stakeholder | Condition Node',
      );
      const agentId = conditionAgent.id;

      await addPrediction({
        variables: {
          subscriptionId,
          agentId,
          variables: {
            userMessage: `We are at at node ${currentNode.current.id}`,
            conversationGraph: JSON.stringify(graph.current),
            nodeVisitData: JSON.stringify(visitedNodes.current),
          },
        },
      });
    }
    // Condition 4 - End
    if (nextNode.type === 'end') {
      console.log('End');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Condition 1. We are at a conversation node
    if (currentNode.current?.type === 'conversation') {
      setMessages((prevMessages) => [...prevMessages, { type: 'text', content: inputMessage, sender: 'user' }]);
      setLoading(true);

      // TODO: Send the message to the server
      // Sleep for 1000ms
      setLoading(false);
      handleNextNode({
        callback: () => {
          setInputMessage('');
        },
      });
    } else {
      console.warn('Not implmented');
    }
  };

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
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question about your data..."
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
            disabled={loading}
          >
            Send
            <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} spin={loading} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}
