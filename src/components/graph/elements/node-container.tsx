import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Handle, Position, useReactFlow, useStore } from '@xyflow/react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import CustomHandle from '../handles/limit-handle';

type NodeContainerProps = {
  title: string;
  faIcon: IconDefinition;
  id: string;
  children: React.ReactNode;
  handlers?: {
    source?: boolean;
    sourceLimit?: number;
    target?: boolean;
    targetLimit?: number;
  };
};

const zoomSelector = (s) => s.transform[2] >= 0.5;

const NodeContainer: React.FC<NodeContainerProps> = ({ title, faIcon, id, children, handlers }) => {
  const showContent = useStore(zoomSelector);
  const { setNodes, setEdges } = useReactFlow();

  const onNodeClick = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const handlerState = { 
    source: handlers?.source ?? true,
    target: handlers?.target ?? true,
    targetLimit: handlers?.targetLimit,
    sourceLimit: handlers?.sourceLimit,
  };

  return (
    <div className="p-4 rounded-3xl bg-white shadow-xl w-96 h-full">
      <div className="relative h-full flex flex-col">
        <div className={showContent ? 'flex items-center' : 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center'}>
          <FontAwesomeIcon 
            icon={faIcon} 
            className={`text-blue-600 mr-2 ${showContent ? 'mr-2' : 'text-3xl mb-2'}`} 
          />
          <div className={showContent ? '' : 'text-left'}>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className={`text-sm text-slate-400 ${showContent ? 'ml-2 inline' : 'mt-1'}`}>#{id}</p>
          </div>
          {showContent && (
            <button
              className="absolute right-0 top-0 w-6 h-6 flex items-center justify-center bg-slate-400 text-white rounded-full hover:bg-red-500 transition-colors"
              onClick={onNodeClick}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <div className={showContent ? 'block' : 'invisible'}>
          {children}
        </div>
      </div>
      {handlerState?.target && (
        <CustomHandle 
          type="target" 
          limit={handlerState.targetLimit} 
          position={Position.Left} 
          className="w-4 h-4 bg-green-500" 
        />
      )}
      {handlerState?.source && (
        <CustomHandle 
          type="source" 
          limit={handlerState.sourceLimit} 
          position={Position.Right} 
          className="w-4 h-4 bg-green-500" 
        />
      )}
    </div>
  );
};

export default NodeContainer;