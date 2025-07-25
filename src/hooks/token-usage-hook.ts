import { useTokenUsage } from '@/providers/token-usage-provider';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

/**
 * Hook that automatically adds tokens for various actions (for demo purposes)
 */
export function useAutoTokenIncrement() {
  const { addTokens } = useTokenUsage();
  const location = useLocation();
  const lastPathRef = useRef<string>('');

  // Simulate token usage on route changes
  useEffect(() => {
    if (lastPathRef.current && lastPathRef.current !== location.pathname) {
      // Different routes use different amounts of tokens
      const routeTokenMap: Record<string, { input: number; output: number }> = {
        '/dashboard': { input: 25, output: 15 },
        '/dashboard/inquiry-builder': { input: 100, output: 75 },
        '/dashboard/agent-lab': { input: 150, output: 100 },
        '/dashboard/user-guide': { input: 50, output: 30 },
      };

      const tokens = routeTokenMap[location.pathname] || { input: 30, output: 20 };
      
      // Add a small delay to make it feel more realistic
      const timer = setTimeout(() => {
        addTokens(tokens.input, tokens.output);
      }, 500);

      return () => clearTimeout(timer);
    }
    
    lastPathRef.current = location.pathname;
  }, [location.pathname, addTokens]);

  // Function to manually add tokens (for testing)
  const simulateApiCall = (size: 'small' | 'medium' | 'large' | 'huge' = 'medium') => {
    const tokenMap = {
      small: { input: 50, output: 30 },
      medium: { input: 200, output: 150 },
      large: { input: 500, output: 300 },
      huge: { input: 2000, output: 1500 },
    };

    const tokens = tokenMap[size];
    addTokens(tokens.input, tokens.output);
  };

  return { simulateApiCall };
}
