import { useUserQuota } from '@/hooks/user-quota';
import { motion } from 'motion/react';
import { useState } from 'react';
import CustomTooltip from '@/components/controls/custom-tooltip';

// Think big motherfuckers goddamn
const TOKEN_TIERS = [
  { level: 1, max: 1000, label: '1K' },
  { level: 2, max: 10000, label: '10K' },
  { level: 3, max: 100000, label: '100K' },
  { level: 4, max: 1000000, label: '1M' },
  { level: 5, max: 10000000, label: '10M' },
  { level: 6, max: 100000000, label: '100M' },
  { level: 7, max: 1000000000, label: '1B' },
  { level: 8, max: 10000000000, label: '10B' },
  { level: 9, max: 100000000000, label: '100B' },
  { level: 10, max: 1000000000000, label: '1T' },
  { level: 11, max: 10000000000000, label: '10T' },
  { level: 12, max: 100000000000000, label: '100T' },
  { level: 13, max: 1000000000000000, label: '1Q' },
];

interface TokenUsageBarProps {
  compact?: boolean;
}

export default function TokenUsageBar({ compact = false }: TokenUsageBarProps) {
  // Check feature flag
  const showTokenUsageBar = import.meta.env.VITE_APP_SHOW_TOKEN_USAGE_BAR !== 'false';
  
  const { usedTotalTokens, usedInputTokens, usedOutputTokens, allowedTokens, loading, updatedAt } = useUserQuota();
  const [isHovered, setIsHovered] = useState(false);

  // Don't render if feature flag is disabled
  if (!showTokenUsageBar) {
    return null;
  }

  // Calculate current tier and progress
  const getCurrentTierInfo = () => {
    let currentTier = TOKEN_TIERS[0];
    let nextTier: typeof TOKEN_TIERS[0] | null = TOKEN_TIERS[1] || null;
    
    for (let i = 0; i < TOKEN_TIERS.length; i++) {
      if (usedTotalTokens <= TOKEN_TIERS[i].max) {
        currentTier = TOKEN_TIERS[i];
        nextTier = TOKEN_TIERS[i + 1] || null;
        break;
      }
    }

    // If we've exceeded all tiers, use the highest tier
    if (usedTotalTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max) {
      currentTier = TOKEN_TIERS[TOKEN_TIERS.length - 1];
      nextTier = null;
    }

    // Calculate progress within current tier
    const progress = Math.min(100, Math.max(0, (usedTotalTokens / currentTier.max) * 100));

    return { currentTier, nextTier, progress };
  };

  const { currentTier, progress } = getCurrentTierInfo();
  const isMaxLevel = usedTotalTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max;

  // Format current tokens with one decimal place in K format
  const formatCurrentTokens = (num: number): string => {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + 'T';
    }
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format the updatedAt timestamp to a readable format
  const formatLastUpdated = (timestamp: string): string => {
    if (!timestamp) return 'Never';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return 'Unknown';
    }
  };

  // Calculate percentages for input/output within current tier
  const inputPercentage = Math.min(100, Math.max(0, (usedInputTokens / currentTier.max) * 100));
  const outputPercentage = Math.min(100, Math.max(0, (usedOutputTokens / currentTier.max) * 100));

  // Get colors based on token usage level
  const getColors = () => {
    if (isMaxLevel) {
      return {
        input: 'bg-purple-300',
        output: 'bg-purple-700',
        background: 'from-purple-400 to-purple-600'
      };
    }
    
    // Stay green until we are above 1M tokens
    if (usedTotalTokens < 1000000) {
      return {
        input: 'bg-green-300',
        output: 'bg-green-700',
        background: 'from-green-400 to-green-600'
      };
    }
    
    // After 1M, use yellow-to-red gradient based on progress
    if (progress < 85) {
      return {
        input: 'bg-yellow-300',
        output: 'bg-yellow-700',
        background: 'from-yellow-400 to-yellow-600'
      };
    } else {
      return {
        input: 'bg-red-300',
        output: 'bg-red-700',
        background: 'from-red-400 to-red-600'
      };
    }
  };

  const colors = getColors();

  // Get glow effect for level completion
  const getGlowClass = () => {
    if (progress >= 95 || isMaxLevel) {
      return 'shadow-lg shadow-current';
    }
    return '';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        {!compact && (
          <span className="text-xs text-gray-600 dark:text-gray-300">Loading...</span>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
          {/* Two-part progress bar for compact view */}
          <motion.div
            className={`absolute top-0 left-0 h-full ${colors.input}`}
            initial={{ width: 0 }}
            animate={{ width: `${inputPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.div
            className={`absolute top-0 h-full ${colors.output}`}
            style={{ left: `${inputPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${outputPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {formatCurrentTokens(usedTotalTokens)}
        </span>
      </div>
    );
  }

  return (
    <CustomTooltip
      triggerOnHover={true}
      placement="bottom"
      render={() => (
        <div
          className="flex items-center space-x-3 px-3 py-2 bg-white/10 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm border border-white/20 dark:border-slate-600/30"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Progress bar */}
          <div className="flex-1 min-w-[120px] max-w-[200px]">
            <div className="w-full h-3 bg-white/20 dark:bg-slate-700 rounded-full overflow-hidden relative">
              {/* Input tokens (light color) */}
              <motion.div
                className={`absolute top-0 left-0 h-full ${colors.input} ${getGlowClass()}`}
                initial={{ width: 0 }}
                animate={{ width: `${inputPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              {/* Output tokens (dark color) */}
              <motion.div
                className={`absolute top-0 h-full ${colors.output} ${getGlowClass()}`}
                style={{ left: `${inputPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${outputPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            
            {/* Progress text */}
            <motion.div
              className="mt-1 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-white/80 dark:text-slate-300">
                {formatCurrentTokens(usedTotalTokens)} / {currentTier.label}
              </span>
            </motion.div>
          </div>

          {/* Achievement indicator */}
          {(progress >= 100 || isMaxLevel) && (
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-yellow-400"
            >
              ⭐
            </motion.div>
          )}
        </div>
      )}
    >
      <div className="p-3 min-w-[200px]">
        <h4 className="font-semibold text-sm mb-3 text-slate-900 dark:text-slate-100">
          Token Usage Breakdown
        </h4>
        
        {/* Input tokens */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${colors.input}`} />
            <span className="text-xs text-slate-700 dark:text-slate-300">Input</span>
          </div>
          <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
            {formatCurrentTokens(usedInputTokens)}
          </span>
        </div>
        
        {/* Output tokens */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${colors.output}`} />
            <span className="text-xs text-slate-700 dark:text-slate-300">Output</span>
          </div>
          <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
            {formatCurrentTokens(usedOutputTokens)}
          </span>
        </div>
        
        {/* Total and max allowed */}
        <div className="border-t border-slate-200 dark:border-slate-600 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300">Total</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatCurrentTokens(usedTotalTokens)}
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-slate-700 dark:text-slate-300">Max Allowed</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatCurrentTokens(allowedTokens)}
            </span>
          </div>
        </div>

        {/* Last updated and update frequency info */}
        <div className="border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <div>Last Updated: {formatLastUpdated(updatedAt)}</div>
            <div className="italic mt-1">*Token usage updates every hour</div>
          </div>
        </div>
      </div>
    </CustomTooltip>
  );
}
