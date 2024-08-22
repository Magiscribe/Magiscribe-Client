export interface ConversationData {
  userId: string;
  data: {
    form: Form;
    graph: Graph;
    nodeVisitData: IndividualConversationData[];
  };
}

export interface Form {
  organizationName: string;
  organizationRole: string;
  inputGoals: string;
  title: string;
  createdAt: number;
}

export interface Graph {
  explanation: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  type: NodeType;
  data?: ConversationNodeData | ConditionNodeData | InformationNodeData;
}

export interface ConversationNodeData {
  text?: string;
  instruction?: string;
  type: 'rating-single' | 'rating-multi' | 'open-ended' | 'scalar-single' | 'scalar-multi';
  ratings?: string[];
  scalars?: string[];
}

export interface ConditionNodeData {
  instruction: string;
}

export interface InformationNodeData {
  type: 'start' | 'end' | 'general';
  text?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface IndividualConversationData {
  userId?: string;
  data: NodeVisitData[];
}

export interface NodeVisitData {
  id: string;
  data?: {
    question?: string;
    explanation?: string;
    text?: string;
    ratings?: string[];
    scalars?: number[];
  };
}

export interface TabProps {
  data: {
    data: {
      form: Form;
      graph: Graph;
      nodeVisitData: IndividualConversationData[];
    };
  };
}
