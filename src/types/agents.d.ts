export interface Model {
  id: string;
  name: string;
  region: string;
}

export interface Prompt {
  id: string;
  name: string;
  text: string;
}

export interface Capability {
  id: string;
  name: string;
  alias: string;
  llmModel: string;
  description: string;
  prompts: Prompt[];
  outputMode: string;
  subscriptionFilter: string;
  outputFilter: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  reasoningPrompt: string;
  reasoning: {
    llmModel: string;
    prompt: string;
    variablePassThrough: boolean;
  };
  capabilities: Capability[];
}
