import { Edge, Node } from '@xyflow/react';

import templateBranchInquiry from './branch-inquiry';
import templateLinearInquiry from './linear-inquiry';
import templateOpenEnded from './open-ended-inquiry';
import templateDefault from './scratch';

export interface Template {
  name: string;
  description: string;
  allowGeneration: boolean;
  draftGraph?: { nodes: Node[]; edges: Edge[] };
}

const templates: Template[] = [
  {
    name: 'Linear Inquiry',
    description: 'Similar to a traditional survey where questions are asked in a fixed, linear order',
    allowGeneration: true,
    draftGraph: templateLinearInquiry,
  },
  {
    name: 'Branching Inquiry',
    description: 'Questions that adapt based on user responses, leading to different questions or paths',
    allowGeneration: true,
    draftGraph: templateBranchInquiry,
  },
  {
    name: 'Open Ended Inquiry',
    description: 'A flexible conversation format where users can freely navigate through various topics',
    allowGeneration: true,
    draftGraph: templateOpenEnded,
  },
  {
    name: 'Start From Scratch',
    description: 'Create a custom inquiry from the ground up, with no predefined structure',
    allowGeneration: false,
    draftGraph: templateDefault,
  },
];

export default templates;
