export interface Capability {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface Agent {
  id: string;
  name: string;
  alias: string;
  description: string;
  aiModel: string;
  capabilities: Capability[];
}
