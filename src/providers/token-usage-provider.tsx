import React, { createContext, useContext, useEffect, useState } from 'react';

// Token tiers - 10x progression stays the same
const TOKEN_TIERS = [
  { level: 1, max: 1000, label: '1K' },
  { level: 2, max: 10000, label: '10K' },
  { level: 3, max: 100000, label: '100K' },
  { level: 4, max: 1000000, label: '1M' },
  { level: 5, max: 10000000, label: '10M' },
  { level: 6, max: 100000000, label: '100M' },
];

interface TokenUsageContext {
  currentTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  currentTier: typeof TOKEN_TIERS[0];
  nextTier: typeof TOKEN_TIERS[0] | null;
  progress: number; // 0-100 percentage within current tier
  addTokens: (inputTokens: number, outputTokens?: number) => void;
  addFromAPI: (tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number }) => void;
  resetTokens: () => void;
  getAllTiers: () => typeof TOKEN_TIERS;
  isMaxLevel: boolean;
}

const TokenUsageContext = createContext<TokenUsageContext | undefined>(undefined);

const STORAGE_KEY = 'magiscribe-token-usage';
const INPUT_TOKENS_KEY = 'magiscribe-input-tokens';
const OUTPUT_TOKENS_KEY = 'magiscribe-output-tokens';

export function TokenUsageProvider({ children }: { children: React.ReactNode }) {
  const [currentTokens, setCurrentTokens] = useState<number>(0);
  const [totalInputTokens, setTotalInputTokens] = useState<number>(0);
  const [totalOutputTokens, setTotalOutputTokens] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedInput = localStorage.getItem(INPUT_TOKENS_KEY);
    const storedOutput = localStorage.getItem(OUTPUT_TOKENS_KEY);
    
    if (stored) {
      try {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setCurrentTokens(parsed);
        }
      } catch (error) {
        console.error('Failed to parse stored token usage:', error);
      }
    }
    
    if (storedInput) {
      try {
        const parsed = parseInt(storedInput, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setTotalInputTokens(parsed);
        }
      } catch (error) {
        console.error('Failed to parse stored input tokens:', error);
      }
    }
    
    if (storedOutput) {
      try {
        const parsed = parseInt(storedOutput, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setTotalOutputTokens(parsed);
        }
      } catch (error) {
        console.error('Failed to parse stored output tokens:', error);
      }
    }
  }, []);

  // Save to localStorage whenever tokens change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentTokens.toString());
  }, [currentTokens]);

  useEffect(() => {
    localStorage.setItem(INPUT_TOKENS_KEY, totalInputTokens.toString());
  }, [totalInputTokens]);

  useEffect(() => {
    localStorage.setItem(OUTPUT_TOKENS_KEY, totalOutputTokens.toString());
  }, [totalOutputTokens]);

  // Calculate current tier and progress
  const getCurrentTierInfo = () => {
    let currentTier = TOKEN_TIERS[0];
    let nextTier: typeof TOKEN_TIERS[0] | null = TOKEN_TIERS[1] || null;
    
    for (let i = 0; i < TOKEN_TIERS.length; i++) {
      if (currentTokens <= TOKEN_TIERS[i].max) {
        currentTier = TOKEN_TIERS[i];
        nextTier = TOKEN_TIERS[i + 1] || null;
        break;
      }
    }

    // If we've exceeded all tiers, use the highest tier
    if (currentTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max) {
      currentTier = TOKEN_TIERS[TOKEN_TIERS.length - 1];
      nextTier = null;
    }

    // Simple calculation: currentTokens / currentTier.max * 100
    let progress = Math.min(100, Math.max(0, (currentTokens / currentTier.max) * 100));

    return { currentTier, nextTier, progress };
  };

  const { currentTier, nextTier, progress } = getCurrentTierInfo();

  const addTokens = (inputTokens: number, outputTokens: number = 0) => {
    const totalNew = inputTokens + outputTokens;
    setCurrentTokens(prev => prev + totalNew);
    setTotalInputTokens(prev => prev + inputTokens);
    setTotalOutputTokens(prev => prev + outputTokens);
  };

  const addFromAPI = (tokenUsage: { inputTokens: number; outputTokens: number; totalTokens: number }) => {
    // Use the total tokens directly from the API for the progress bar
    setCurrentTokens(prev => prev + tokenUsage.totalTokens);
    setTotalInputTokens(prev => prev + tokenUsage.inputTokens);
    setTotalOutputTokens(prev => prev + tokenUsage.outputTokens);
  };

  const resetTokens = () => {
    setCurrentTokens(0);
    setTotalInputTokens(0);
    setTotalOutputTokens(0);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INPUT_TOKENS_KEY);
    localStorage.removeItem(OUTPUT_TOKENS_KEY);
  };

  const getAllTiers = () => TOKEN_TIERS;

  const isMaxLevel = currentTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max;

  const value: TokenUsageContext = {
    currentTokens,
    totalInputTokens,
    totalOutputTokens,
    currentTier,
    nextTier,
    progress,
    addTokens,
    addFromAPI,
    resetTokens,
    getAllTiers,
    isMaxLevel,
  };

  return (
    <TokenUsageContext.Provider value={value}>
      {children}
    </TokenUsageContext.Provider>
  );
}

export function useTokenUsage() {
  const context = useContext(TokenUsageContext);
  if (context === undefined) {
    throw new Error('useTokenUsage must be used within a TokenUsageProvider');
  }
  return context;
}
