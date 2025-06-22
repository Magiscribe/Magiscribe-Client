import { GetInquiryQuery, GetInquiryResponsesQuery } from '@/graphql/graphql';

/**
 * Minimized data structure for efficient LLM analysis
 */
export interface MinimizedAnalysisData {
  summary: {
    totalResponses: number;
    inquiryTitle: string;
  };
  questions: {
    [nodeId: string]: {
      text: string;
      type: 'single-select' | 'multi-select' | 'open-ended';
      options?: string[]; // Only for select questions
    };
  };
  responses: {
    userId: string;
    name?: string;
    email?: string;
    answers: {
      [nodeId: string]: {
        text?: string;
        selected?: string[]; // For select questions
      };
    };
  }[];
}

/**
 * Transforms full inquiry data into a minimized format optimized for LLM analysis
 * Reduces token usage by ~60-80% while preserving analytical value
 */
export function minimizeAnalysisData(
  inquiryData: GetInquiryQuery | undefined,
  responseData: GetInquiryResponsesQuery | undefined
): MinimizedAnalysisData {
  const responses = responseData?.getInquiryResponses ?? [];
  const graph = inquiryData?.getInquiry?.data?.graph ?? inquiryData?.getInquiry?.data?.draftGraph;
  const settings = inquiryData?.getInquiry?.data?.settings;

  // Extract questions from the graph
  const questions: MinimizedAnalysisData['questions'] = {};
  
  if (graph?.nodes) {
    graph.nodes.forEach((node: any) => {
      if (node.type === 'question' && node.data) {
        const nodeType = node.data.type;
        
        // Only include supported question types
        if (['single-select', 'multi-select', 'open-ended'].includes(nodeType)) {
          questions[node.id] = {
            text: node.data.text || '',
            type: nodeType as 'single-select' | 'multi-select' | 'open-ended',
            ...(node.data.ratings && ['single-select', 'multi-select'].includes(nodeType) && {
              options: node.data.ratings
            })
          };
        }
      }
    });
  }

  // Transform responses to minimized format
  const minimizedResponses = responses.map((response) => {
    const userAnswers: { [nodeId: string]: { text?: string; selected?: string[] } } = {};
    
    // Process each node visit in the user's history
    if (response.data?.history) {
      response.data.history.forEach((nodeVisit: any) => {
        const nodeId = nodeVisit.id;
        
        // Only include answers for question nodes we care about
        if (questions[nodeId] && nodeVisit.data?.response) {
          const responseData = nodeVisit.data.response;
          
          userAnswers[nodeId] = {
            ...(responseData.text && { text: responseData.text }),
            ...(responseData.ratings && { selected: responseData.ratings })
          };
        }
      });
    }

    return {
      userId: response.userId || response.id || 'anonymous',
      ...(response.data?.userDetails?.name && { name: response.data.userDetails.name }),
      ...(response.data?.userDetails?.email && { email: response.data.userDetails.email }),
      answers: userAnswers
    };
  });

  return {
    summary: {
      totalResponses: responses.length,
      inquiryTitle: settings?.title || 'Untitled Inquiry'
    },
    questions,
    responses: minimizedResponses
  };
}