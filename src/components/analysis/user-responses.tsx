import { GraphNode, NodeVisitAnalysisData } from '@/types/conversation';
import { FC, useMemo } from 'react';

interface UserResponsesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inquiryData: any;
  userData: NodeVisitAnalysisData[];
}

/**
 * Renders user response ratings and text
 */
const ResponseContent: FC<{
  responseText?: string;
  ratings?: string[];
}> = ({ responseText, ratings = [] }) => (
  <p className="text-slate-700 dark:text-white">
    {responseText && <span>{responseText}</span>}
    {ratings.length > 0 && (
      <span>
        {responseText ? ' - ' : ''}
        {ratings.join(', ')}
      </span>
    )}
  </p>
);

/**
 * Renders a single node's content including question and response
 */
const NodeContent: FC<{ node: NodeVisitAnalysisData }> = ({ node }) => (
  <>
    <p className="font-semibold text-slate-700 dark:text-white">{node?.data?.text}</p>
    {node?.data?.response && (
      <>
        <hr className="my-2 border-slate-300 dark:border-slate-600" />
        <ResponseContent responseText={node.data.response.text} ratings={node.data.response.ratings} />
      </>
    )}
  </>
);

/**
 * UserResponses component displays inquiry responses with their associated data
 * @param props - Component properties
 * @returns Rendered response collection
 */
export default function UserResponses({ inquiryData, userData }: UserResponsesProps) {
  const nodesMap = useMemo(
    () =>
      Object.fromEntries((inquiryData?.getInquiry?.data?.graph?.nodes || []).map((node: GraphNode) => [node.id, node])),
    [inquiryData?.getInquiry?.data?.graph?.nodes],
  );

  const renderNodeContent = (node: NodeVisitAnalysisData) => <NodeContent node={node} />;

  return (
    <div className="w-full space-y-4">
      {userData.map((node) => {
        const graphNode = nodesMap[node.id];
        if (!graphNode?.type || !['question', 'information'].includes(graphNode.type)) {
          return null;
        }

        return (
          <div className="mb-4 p-4 bg-slate-200 dark:bg-slate-600 rounded-2xl" role="article">
            {renderNodeContent(node)}
          </div>
        );
      })}
    </div>
  );
}
