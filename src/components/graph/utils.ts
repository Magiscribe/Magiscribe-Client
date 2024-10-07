import { faCodeBranch, faExclamationCircle, faPlay, faQuestionCircle, faStop } from '@fortawesome/free-solid-svg-icons';
import { EdgeTypes, NodeTypes, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { EndNode, StartNode } from './nodes/start-end-node';
import QuestionNode from './nodes/question-node';
import ConditionNode from './nodes/condition-node';
import InformationNode from './nodes/information-node';
import ButtonEdge from './edges/button-edge';

export const nodeTypesInfo = {
  start: {
    name: 'Start',
    icon: faPlay,
    description: 'The start node represents the beginning of the conversation flow. There can only be one start node.',
    element: StartNode,
  },
  information: {
    name: 'Information',
    icon: faExclamationCircle,
    description: 'The information node provides information to the user without requiring a response.',
    element: InformationNode,
  },
  question: {
    name: 'Question',
    icon: faQuestionCircle,
    description:
      "The question node represents a point where the user is asked a question. The question can be dynamically generated based on the user's previous responses.",
    element: QuestionNode,
  },
  condition: {
    name: 'Condition',
    icon: faCodeBranch,
    description:
      "The condition node allows for the conversation to take a different path based on the user's response.",
    element: ConditionNode,
  },
  end: {
    name: 'End',
    icon: faStop,
    description: 'The end node represents the end of the conversation flow. There can be multiple end nodes.',
    element: EndNode,
  },
};

export const nodeTypes: NodeTypes = Object.fromEntries(
  Object.entries(nodeTypesInfo).map(([type, { element }]) => [type, element]),
);

export const edgeTypes: EdgeTypes = {
  button: ButtonEdge,
};

export function useNodeData<T>(id: string) {
  const { updateNodeData } = useReactFlow();

  const update = useCallback(
    (updates: Partial<T>) => {
      updateNodeData(id, updates);
    },
    [id],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target;
      if (type === 'checkbox') {
        const checked = (event.target as HTMLInputElement).checked;
        update({ [name]: checked } as Partial<T>);
      } else {
        update({ [name]: value } as Partial<T>);
      }
    },
    [updateNodeData],
  );

  return { handleInputChange };
}
