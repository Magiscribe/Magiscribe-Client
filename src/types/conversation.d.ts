import { GetInquiryResponsesQuery } from '@/graphql/graphql';

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
  type: 'start' | 'end' | 'question' | 'information' | 'condition';
  data?: QuestionNodeData | ConditionNodeData | InformationNodeData;
}

export interface QuestionNodeData {
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

export interface NodeVisitAnalysisData {
  id: string;
  data?: {
    text?: string;
    response?: {
      text?: string;
      ratings?: string[];
    };
    ratings?: string[];
    scalars?: number[];
  };
}

export interface TabProps {
  data: {
    id: string;
    form: Form;
    graph: Graph;
    responses: NonNullable<GetInquiryResponsesQuery['getInquiryResponses']>;
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
