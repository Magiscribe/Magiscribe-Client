import { useMutation, useSubscription } from '@apollo/client';
import { useState } from 'react';
import { SEND_STREAM_EVENT } from '../../clients/mutations';
import { STREAM_EVENT_SUBSCRIPTION } from '../../clients/subscriptions';
import Canvas, { LineProps } from '../../components/canvas';

export default function CanvasDashboard() {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [drawing, setDrawing] = useState<LineProps[]>([]);

  const [streamObject] = useMutation(SEND_STREAM_EVENT);

  const handleStreamDrawing = (drawing: LineProps[]) => {
    streamObject({ variables: { subscriptionId, data: { drawing } } });
  };

  useSubscription(STREAM_EVENT_SUBSCRIPTION, {
    variables: { subscriptionId }, // 'canvas' is the default subscriptionId, but it can be changed to any string, e.g. 'canvas-1
    shouldResubscribe: true,
    skip: !subscriptionId,
    onSubscriptionData: ({ subscriptionData }) => {
      const receivedDrawing = subscriptionData.data.streamObject.data.drawing;
      setDrawing(receivedDrawing);
    },
  });

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <h1 className="text-3xl font-bold">Canvas</h1>
      <div className="mt-4">
        <label htmlFor="subscriptionId" className="block text-sm font-semibold text-gray-700 mb-2">
          Subscription ID
        </label>
        <input
          id="subscriptionId"
          type="text"
          onChange={(e) => setSubscriptionId(e.target.value)}
          value={subscriptionId}
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
        />
      </div>
      <div className="flex justify-center mt-8">
        <Canvas drawing={drawing} setDrawing={setDrawing} onDrawDone={handleStreamDrawing} />
      </div>
    </div>
  );
}
