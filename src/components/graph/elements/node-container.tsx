import Button from '@/components/controls/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useReactFlow } from '@xyflow/react';

type NodeContainerProps = {
  title: string;
  faIcon: IconDefinition;
  id: string;
  children: React.ReactNode;
};

const NodeContainer = ({ title, faIcon, id, children }: NodeContainerProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const onNodeClick = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-3xl bg-white dark:bg-slate-700 w-96 shadow-xl">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faIcon} className="mr-2 text-blue-600 dark:text-blue-400" />
        <Button
          onClick={onNodeClick}
          variant="transparentSecondary"
          size="small"
          icon={faTimesCircle}
          className="absolute right-3 top-3 flex items-center justify-center hover:text-red-500"
        />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        <p className="ml-2 text-sm text-slate-400">#{id}</p>
      </div>
      <div className="space-y-4 my-2">{children}</div>
    </div>
  );
};

export default NodeContainer;
