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
  llmModel: String;
  description: string;
  prompts: Prompt[];
  outputMode: String;
  subscriptionFilter: String;
  outputFilter: String;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  reasoningPrompt: string;
  capabilities: Capability[];
}
