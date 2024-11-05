import { Edge, Node } from '@xyflow/react';

const templateDefault: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: '0',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {
        text: '',
        requireName: false,
        requireEmail: false,
      },
    },
  ],
  edges: [],
};

export default templateDefault;
