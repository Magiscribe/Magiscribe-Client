import { useUserQuota } from '@/hooks/user-quota';
import { motion } from 'motion/react';
import { useState } from 'react';

interface TokenUsageBarProps {
  compact?: boolean;
}

export default function TokenUsageBar({ compact = false }: TokenUsageBarProps) {
  const { usedTokens, allowedTokens, loading } = useUserQuota();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate progress from real quota data
  const progress = Math.min(100, Math.max(0, (usedTokens / allowedTokens) * 100));

  // Format current tokens with one decimal place in K format
  const formatCurrentTokens = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format allowed tokens for display
  const formatAllowedTokens = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  // Get progress bar color based on progress (keep existing logic)
  const getProgressColor = () => {
    if (progress >= 95) {
      return 'from-purple-400 to-purple-600';
    }
    
    if (progress < 60) {
      return 'from-green-400 to-green-600';
    } else if (progress < 85) {
      return 'from-yellow-400 to-yellow-600';
    } else {
      return 'from-red-400 to-red-600';
    }
  };

  // Get glow effect for high usage
  const getGlowClass = () => {
    if (progress >= 95) {
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
            {formatCurrentTokens(usedTokens)} / {formatAllowedTokens(allowedTokens)}
          </span>
        </motion.div>
      </div>

      {/* Achievement indicator */}
      {progress >= 100 && (
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
