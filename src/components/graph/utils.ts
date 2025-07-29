import { faCodeBranch, faExclamationCircle, faPlay, faQuestionCircle, faStop, faCog } from '@fortawesome/free-solid-svg-icons';
import { EdgeTypes, NodeTypes, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import QuestionNode from './nodes/question-node';
import ConditionNode from './nodes/condition-node';
import InformationNode from './nodes/information-node';
import IntegrationNode from './nodes/integration-node';
import ButtonEdge from './edges/button-edge';
import StartNode from './nodes/start-node';
import EndNode from './nodes/end-node';
import { ImageMetadata } from '@/types/conversation';

export const nodeTypesInfo = {
  start: {
    name: 'Start',
    icon: faPlay,
    description: 'The start node represents the beginning of the conversation flow. There can only be one start node.',
    element: StartNode,
    defaultData: {},
  },
  information: {
    name: 'Information',
    icon: faExclamationCircle,
    description: 'The information node provides information to the user without requiring a response.',
    element: InformationNode,
    defaultData: {
      text: '',
      dynamicGeneration: false,
    },
  },
  integration: {
    name: 'Integration',
    icon: faCog,
    description: 'The integration node allows executing external MCP tools and retrieving or updating data from external systems.',
    element: IntegrationNode,
    defaultData: {
      selectedIntegration: '',
      prompt: '',
    },
  },
  question: {
    name: 'Question',
    icon: faQuestionCircle,
    description:
      "The question node represents a point where the user is asked a question. The question can be dynamically generated based on the user's previous responses.",
    element: QuestionNode,
    defaultData: {
      text: '',
      type: 'open-ended',
      ratings: [],
      dynamicGeneration: false,
    },
  },
  condition: {
    name: 'Condition',
    icon: faCodeBranch,
    description:
      "The condition node allows for the conversation to take a different path based on the user's response.",
    element: ConditionNode,
    defaultData: { conditions: [] },
  },
  end: {
    name: 'End',
    icon: faStop,
    description: 'The end node represents the end of the conversation flow. There can be multiple end nodes.',
    element: EndNode,
    defaultData: {},
  },
};

export const nodeTypes: NodeTypes = Object.fromEntries(
  Object.entries(nodeTypesInfo).map(([type, { element }]) => [type, element]),
);

export const edgeTypes: EdgeTypes = {
  button: ButtonEdge,
};

export function getDefaultNodeData(type: keyof typeof nodeTypesInfo) {
  return nodeTypesInfo[type].defaultData;
}

/**
 * A custom React hook for managing node data in a React Flow application.
 *
 * @param {string} id - The unique identifier of the node.
 * @returns {Object} - An object containing the `handleInputChange` and `updateNodeImages` functions.
 */
export function useNodeData<T>(id: string) {
  const { updateNodeData } = useReactFlow();

  /**
   * Updates the node data with the provided partial updates.
   *
   * @param {Partial<T>} updates - The partial updates to apply to the node data.
   * @returns {void}
   */
  const update = useCallback(
    (updates: Partial<T>) => {
      updateNodeData(id, updates);
    },
    [id, updateNodeData],
  );

  /**
   * Handles input changes for the node data.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} event - The input change event.
   * @returns {void}
   */
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

  /**
   * Updates the node images in the component state.
   *
   * @param {ImageMetadata[]} images - An array of image metadata objects.
   * @returns {void}
   */
  const updateNodeImages = useCallback(
    (images: ImageMetadata[]) => {
      updateNodeData(id, { images: images || [] });
    },
    [id, updateNodeData],
  );

  return { handleInputChange, updateNodeImages };
}

export function generateRandomColorHex() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
