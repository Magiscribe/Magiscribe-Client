import {
  faExclamationCircle,
  faPlay,
  faQuestionCircle,
  faStop,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { EdgeTypes, NodeTypes, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { EndNode, StartNode } from './nodes/start-end-node';
import ConversationNode from './nodes/conversation-node';
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
  end: {
    name: 'End',
    icon: faStop,
    description: 'The end node represents the end of the conversation flow. There can only be one end node.',
    element: EndNode,
  },
  conversation: {
    name: 'Conversation',
    icon: faUserFriends,
    description:
      "The conversation node represents a point in the conversation flow where the user is prompted for a response. This reponse can be dynamically generated based on the user's previous responses.",
    element: ConversationNode,
  },
  condition: {
    name: 'Condition',
    icon: faQuestionCircle,
    description:
      "The condition node allows for the conversation to take a different path based on the user's response.",
    element: ConditionNode,
  },
  information: {
    name: 'Information',
    icon: faExclamationCircle,
    description: 'The information node provides information to the user without requiring a response.',
    element: InformationNode,
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
