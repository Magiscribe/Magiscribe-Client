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
  type: 'start' | 'end' | 'conversation' | 'information' | 'condition';
  data?: ConversationNodeData | ConditionNodeData | InformationNodeData;
}

export interface ConversationNodeData {
  text: string;
  response: string;
  type: 'rating-single' | 'rating-multi' | 'open-ended' | 'scalar-single' | 'scalar-multi';
  ratings?: string[];
  scalars?: string[];
}

export interface ConditionNodeData {
  text: string;
}

export interface InformationNodeData {
  text: string;
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
    response?: string;
    ratings?: string[];
    scalars?: number[];
  };
}

export interface TabProps {
  data: {
    form: Form;
    graph: Graph;
    nodeVisitData: IndividualConversationData[];
  };
}

export interface Tag {
  [key: string]: string[];
}

export interface PerResponseSummary {
  tags: Tag[];
}

export interface QuestionSummary {
  nodeId: string;
  responseCount: number;
  textSummary?: string;
  ratingSummary?: RatingSummary;
  scalarSummary?: ScalarSummary;
}

export interface PerQuestionSummary {
  questions: QuestionSummary[];
}

export interface Summary {
  perResponse: PerResponseSummary;
  perQuestion: PerQuestionSummary;
}

export interface RatingSummary {
  counts: Record<string, number>;
}

export interface ScalarSummary {
  min: number;
  max: number;
  mean: number;
  median: number;
  standardDeviation: number;
}
