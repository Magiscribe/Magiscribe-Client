export interface Form {
  organizationName: string;
  inputGoals: string;
  userId: string | null | undefined;
  title: string;
  createdAt: number;
}

export interface Question {
  title: string;
  question: string;
}

export interface Response {
  [userId: string]: {
    [questionIndex: number]: {
      text?: string;
      audio?: string;
      drawing?: string;
      rating?: string | string[];
    } | null;
  };
}

export interface AIAnalysis {
  title: string;
  question: string;
  summary: string;
}

export interface ChartData {
  title: string;
  chartType: string;
  data: Array<{ name: string; value: number }>;
}

export interface Message {
  type: 'text' | 'chart';
  content: string | ChartData;
  sender: 'user' | 'bot';
}

export interface AnalyzePerResponseProps {
  responses: Response[];
  questions: Question[];
}

export interface AnalyzePerQuestionProps {
  questions: Question[];
  responses: Response[];
}

export interface AnalyzeViaChatProps {
  data: {
    form: Form;
    questions: Question[];
    responses: Response[];
  };
}
