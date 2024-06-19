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
  description: string;
  prompts: Prompt[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  reasoningPrompt: string;
  capabilities: Capability[];
}
