import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useReactFlow } from '@xyflow/react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const nodeContainerBaseClass = 'px-4 py-2 shadow-md rounded-3xl bg-white w-96 shadow-xl';

type NodeContainerProps = {
  title: string;
  faIcon: IconDefinition;
  id: string;
  children: React.ReactNode;
  isInputSelected?: boolean;
};

const NodeContainer = ({ title, faIcon, id, children, isInputSelected }: NodeContainerProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const onNodeClick = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div className={!isInputSelected ? nodeContainerBaseClass + ' custom-drag-handle' : nodeContainerBaseClass}>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faIcon} className="mr-2 text-blue-600" />
        <button
          className="w-6 h-6 bg-slate-400 text-white rounded-full absolute right-3 top-3 flex items-center justify-center hover:bg-red-500 transition-colors"
          onClick={onNodeClick}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="ml-2 text-sm text-slate-400">#{id}</p>
      </div>
      {children}
    </div>
  );
};

export default NodeContainer;
