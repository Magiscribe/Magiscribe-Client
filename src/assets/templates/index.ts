import { Edge, Node } from '@xyflow/react';

import templateBranchInquiry from './branch-inquiry';
import templateOpenEnded from './open-ended-inquiry';
import templateDefault from './scratch';
import templatePersonalAgent from './personal-agent-inquiry';

export interface Template {
  name: string;
  description: string;
  allowGeneration: boolean;
  graph?: { nodes: Node[]; edges: Edge[] };
}

const templates: Template[] = [
  {
    name: 'Personal Agent EXPERIMENTAL',
    description: 'Configure a personal agent to handle networking outreach on your behalf chatting with other agents',
    allowGeneration: true,
    graph: templatePersonalAgent,
  },
  {
    name: 'Branching Inquiry',
    description: 'Questions that adapt based on user responses, leading to different questions or paths',
    allowGeneration: true,
    graph: templateBranchInquiry,
  },
  {
    name: 'Open Ended Inquiry',
    description: 'A flexible conversation format where users can freely navigate through various topics',
    allowGeneration: true,
    graph: templateOpenEnded,
  },
  {
    name: 'Start From Scratch',
    description: 'Create a custom inquiry from the ground up, with no predefined structure',
    allowGeneration: false,
    graph: templateDefault,
  },
];

export default templates;
