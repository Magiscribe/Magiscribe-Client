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
  currentTier: typeof TOKEN_TIERS[0];
  nextTier: typeof TOKEN_TIERS[0] | null;
  progress: number; // 0-100 percentage within current tier
  addTokens: (inputTokens: number, outputTokens?: number) => void;
  resetTokens: () => void;
  getAllTiers: () => typeof TOKEN_TIERS;
  isMaxLevel: boolean;
}

const TokenUsageContext = createContext<TokenUsageContext | undefined>(undefined);

const STORAGE_KEY = 'magiscribe-token-usage';

export function TokenUsageProvider({ children }: { children: React.ReactNode }) {
  const [currentTokens, setCurrentTokens] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
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
  }, []);

  // Save to localStorage whenever tokens change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentTokens.toString());
  }, [currentTokens]);

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

    const tierStart = currentTier.level === 1 ? 0 : TOKEN_TIERS[currentTier.level - 2].max;
    const tierRange = currentTier.max - tierStart;
    const tokensInTier = currentTokens - tierStart;
    let progress = Math.min(100, Math.max(0, (tokensInTier / tierRange) * 100));
    
    // Ensure progress is always at least 10% when you have tokens in the tier
    if (tokensInTier > 0 && progress < 10) {
      progress = 10;
    }

    return { currentTier, nextTier, progress };
  };

  const { currentTier, nextTier, progress } = getCurrentTierInfo();

  const addTokens = (inputTokens: number, outputTokens: number = 0) => {
    const totalNew = inputTokens + outputTokens;
    setCurrentTokens(prev => prev + totalNew);
  };

  const resetTokens = () => {
    setCurrentTokens(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getAllTiers = () => TOKEN_TIERS;

  const isMaxLevel = currentTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max;

  const value: TokenUsageContext = {
    currentTokens,
    currentTier,
    nextTier,
    progress,
    addTokens,
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
