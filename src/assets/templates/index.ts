import { Edge, Node } from '@xyflow/react';

import templateBranchSurvey from './branch-survey';
import templateLinearSurvey from './linear-survey';
import templateOpenEnded from './open-ended';
import templateDefault from './scratch';

export interface Template {
  name: string;
  description: string;
  allowGeneration: boolean;
  graph?: { nodes: Node[]; edges: Edge[] };
}

const templates: Template[] = [
  {
    name: 'Linear Survey',
    description: 'A straightforward survey where questions are asked in a fixed, linear order.',
    allowGeneration: true,
    graph: templateLinearSurvey,
  },
  {
    name: 'Branching Survey',
    description: 'A survey that adapts based on user responses, leading to different questions or paths.',
    allowGeneration: true,
    graph: templateBranchSurvey,
  },
  {
    name: 'Open Ended',
    description: 'A flexible conversation format where users can freely navigate through various topics.',
    allowGeneration: true,
    graph: templateOpenEnded,
  },
  {
    name: 'From Scratch',
    description: 'Create a custom inquiry from the ground up, with no predefined structure.',
    allowGeneration: false,
    graph: templateDefault,
  },
];

export default templates;
