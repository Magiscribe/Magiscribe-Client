export interface TokenTier {
  level: number;
  max: number;
  label: string;
}

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
  timestamp: number;
}

export interface TokenUsageState {
  currentTokens: number;
  usageHistory: TokenUsage[];
  achievements: string[];
}

export type ApiCallSize = 'small' | 'medium' | 'large' | 'huge';

export interface TokenUsageContextType {
  currentTokens: number;
  currentTier: TokenTier;
  nextTier: TokenTier | null;
  progress: number;
  addTokens: (inputTokens: number, outputTokens?: number) => void;
  resetTokens: () => void;
  getAllTiers: () => TokenTier[];
  isMaxLevel: boolean;
  getUsageHistory: () => TokenUsage[];
}
