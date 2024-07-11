import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useState } from 'react';
import { SEND_STREAM_EVENT } from '../../clients/mutations';
import { STREAM_EVENT_QUERY } from '../../clients/queries';
import { STREAM_EVENT_SUBSCRIPTION } from '../../clients/subscriptions';
import Canvas, { LineProps } from '../../components/canvas';

export default function CanvasDashboard() {
  const [changingSubscription, setChangingSubscription] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [activeSubscriptionId, setActiveSubscriptionId] = useState('');
  const [drawing, setDrawing] = useState<LineProps[]>([]);

  const { refetch } = useQuery(STREAM_EVENT_QUERY, {
    variables: { subscriptionId: activeSubscriptionId },
    skip: !activeSubscriptionId,
    errorPolicy: 'all',
    onCompleted: ({ streamObject }) => {
      setDrawing(streamObject.data.drawing);
    },
    onError: () => {
      setDrawing([]);
    },
  });
  const [streamObject] = useMutation(SEND_STREAM_EVENT);

  const handleStreamDrawing = (drawing: LineProps[]) => {
    if (changingSubscription) {
      return;
    }

    streamObject({
      variables: {
        subscriptionId: activeSubscriptionId,
        data: { drawing },
      },
    });
  };

  useSubscription(STREAM_EVENT_SUBSCRIPTION, {
    variables: { subscriptionId: activeSubscriptionId }, // 'canvas' is the default subscriptionId, but it can be changed to any string, e.g. 'canvas-1
    shouldResubscribe: true,
    skip: !activeSubscriptionId,
    onSubscriptionData: ({ subscriptionData }) => {
      const receivedDrawing = subscriptionData.data.streamObject.data.drawing;
      setDrawing(receivedDrawing);
    },
  });

  const joinSubscription = () => {
    setChangingSubscription(true);
    setActiveSubscriptionId(subscriptionId);
    setSubscriptionId('');

    refetch().then(({ data }) => {
      if (data && data.streamObject) {
        setDrawing(data.streamObject.data.drawing);
      }
      setChangingSubscription(false);
    });
  };
  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <h1 className="text-3xl font-bold">Canvas {activeSubscriptionId ? `(${activeSubscriptionId})` : ''}</h1>
      <div className="mt-4">
        <label htmlFor="subscriptionId" className="block text-sm font-semibold text-gray-700 mb-2">
          Subscription ID
        </label>
        <div className="flex">
          <input
            id="subscriptionId"
            type="text"
            onChange={(e) => setSubscriptionId(e.target.value)}
            value={subscriptionId}
            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          <button
            onClick={joinSubscription}
            className="ml-2 px-4 py-2 text-white bg-red-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            Join
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Canvas drawing={drawing} setDrawing={setDrawing} onDrawDone={handleStreamDrawing} />
      </div>
    </div>
  );
}
