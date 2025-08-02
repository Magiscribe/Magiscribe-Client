import { useUserQuota } from '@/hooks/user-quota';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'motion/react';
import { useState } from 'react';

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
  
  const { usedTokens, loading, manualRefresh, isRefreshing } = useUserQuota();
  const [isHovered, setIsHovered] = useState(false);

  // Don't render if feature flag is disabled
  if (!showTokenUsageBar) {
    return null;
  }

  // Calculate current tier and progress like the original system
  const getCurrentTierInfo = () => {
    let currentTier = TOKEN_TIERS[0];
    let nextTier: typeof TOKEN_TIERS[0] | null = TOKEN_TIERS[1] || null;
    
    for (let i = 0; i < TOKEN_TIERS.length; i++) {
      if (usedTokens <= TOKEN_TIERS[i].max) {
        currentTier = TOKEN_TIERS[i];
        nextTier = TOKEN_TIERS[i + 1] || null;
        break;
      }
    }

    // If we've exceeded all tiers, use the highest tier
    if (usedTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max) {
      currentTier = TOKEN_TIERS[TOKEN_TIERS.length - 1];
      nextTier = null;
    }

    // Calculate progress within current tier
    const progress = Math.min(100, Math.max(0, (usedTokens / currentTier.max) * 100));

    return { currentTier, nextTier, progress };
  };

  const { currentTier, progress } = getCurrentTierInfo();
  const isMaxLevel = usedTokens > TOKEN_TIERS[TOKEN_TIERS.length - 1].max;

  // Handle manual refresh
  const handleManualRefresh = async () => {
    try {
      await manualRefresh();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

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

  // Get progress bar color based on absolute token count
  const getProgressColor = () => {
    if (isMaxLevel) {
      return 'from-purple-400 to-purple-600';
    }
    
    // Stay green until we are above 1M tokens and working towards 10M
    if (usedTokens < 1000000) {
      return 'from-green-400 to-green-600';
    }
    
    // After 10M, use orange-to-red gradient based on progress within current tier
    if (progress < 85) {
      return 'from-yellow-400 to-yellow-600';
    } else {
      return 'from-red-400 to-red-600';
    }
  };

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
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} ${getGlowClass()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {formatCurrentTokens(usedTokens)}
        </span>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="p-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
          title="Refresh quota"
        >
          <FontAwesomeIcon 
            icon={faRefresh} 
            className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-3 px-3 py-2 bg-white/10 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm border border-white/20 dark:border-slate-600/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar */}
      <div className="flex-1 min-w-[120px] max-w-[200px]">
        <div className="w-full h-3 bg-white/20 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} ${getGlowClass()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
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
            {formatCurrentTokens(usedTokens)} / {currentTier.label}
          </span>
        </motion.div>
      </div>

      {/* Manual refresh button */}
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="p-2 text-white/70 hover:text-white dark:text-slate-300 dark:hover:text-white disabled:opacity-50 transition-colors"
        title="Refresh quota now"
      >
        <FontAwesomeIcon 
          icon={faRefresh} 
          className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
        />
      </button>

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
  );
}
