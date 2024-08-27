import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GraphNode, ConversationNodeData, TabProps } from '@/types/conversation';
import Chart, { ChartProps, ChartData } from '@/components/chart';

const PerQuestionTab: React.FC<TabProps> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { graph, nodeVisitData: responses, summary } = data.data;

  if (!responses) return <div className="p-4">No data available</div>;

  const conversationNodes = useMemo(
    () =>
      graph.nodes.filter(
        (node): node is GraphNode & { data: ConversationNodeData } =>
          node.type === 'conversation' && node.data !== undefined && 'type' in node.data,
      ),
    [graph.nodes],
  );

  if (!conversationNodes.length) {
    return <div className="p-4">No conversation nodes found.</div>;
  }
  const currentNode = conversationNodes[currentQuestionIndex];
  const nodeData = currentNode.data;

  const currentSummary = summary.perQuestion.questions.find((q) => q.nodeId === currentNode.id);

  const renderBarChart = (ratingSummary: { counts: { [key: string]: number } }) => {
    const chartData: ChartData[] = Object.entries(ratingSummary.counts).map(([name, value]) => ({ name, value }));
    const chartProps: ChartProps = {
      title: 'Rating Distribution',
      chartType: 'BarChart',
      data: chartData,
    };
    return <Chart {...chartProps} />;
  };

  const renderAnswers = (nodeId: string) =>
    responses.map((response) => {
      const answer = response.data.find((node) => node.id === nodeId);
      if (answer?.data) {
        const answerContent = answer.data.text || answer.data.ratings?.join(', ') || answer.data.scalars?.join(', ');
        return (
          <div key={`${response.userId}-${nodeId}`} className="ml-4 mb-2">
            <p className="text-black">
              <span className="font-semibold">{response.userId}:</span>{' '}
              {answer.data.question ? (
                <>
                  <span className="font-semibold">{answer.data.question}</span>
                  <br />
                  {answerContent}
                </>
              ) : (
                answerContent
              )}
            </p>
          </div>
        );
      }
      return null;
    });

  return (
    <div className="bg-white px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Per Question</h2>
      </div>
      <div className="my-4">
        <h2 className="font-bold mb-2">Select Question</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-6 gap-2">
          {conversationNodes.map((node, index) => (
            <button
              key={node.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`p-2 text-sm rounded-md ${
                currentQuestionIndex === index ? 'bg-blue-500 text-white' : 'bg-slate-200 text-black'
              }`}
            >
              {node.data.text || `Question ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-bold mb-2">Responses</h2>
        <div className="mb-6 p-4">
          {currentSummary?.textSummary && (
            <div className="mb-4 p-4 bg-blue-100 rounded">
              <h3 className="font-semibold mb-2 text-black">AI Summary</h3>
              <p className="text-black">{currentSummary.textSummary}</p>
            </div>
          )}
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <>
              <p className="font-semibold mb-2 text-black">{nodeData.text}</p>
              {currentSummary && currentSummary.ratingSummary && (
                <div className="mb-4">{renderBarChart(currentSummary.ratingSummary)}</div>
              )}
              {renderAnswers(currentNode.id)}
            </>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          {[faChevronLeft, faChevronRight].map((icon, index) => (
            <button
              key={index}
              onClick={() =>
                setCurrentQuestionIndex(
                  (prev) => (prev + (index ? 1 : -1) + conversationNodes.length) % conversationNodes.length,
                )
              }
              className="p-2 border-2 border-white rounded-full"
            >
              <FontAwesomeIcon icon={icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerQuestionTab;
