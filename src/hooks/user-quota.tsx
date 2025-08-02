import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_USER_QUOTA } from '@/clients/queries';

interface UserQuota {
  userId: string;
  allowedTokens: number;
  usedTokens: number;
  createdAt: string;
  updatedAt: string;
}

interface UseUserQuotaReturn {
  usedTokens: number;
  allowedTokens: number;
  loading: boolean;
  error: any;
  refetch: () => void;
}

/**
 * Hook for fetching and managing user quota data from GraphQL
 * Auto-refreshes at 1 minute past each hour
 */
export function useUserQuota(): UseUserQuotaReturn {
  const { data, loading, error, refetch } = useQuery<{ getUserQuota: UserQuota }>(GET_USER_QUOTA, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Auto-refresh every hour at 1 minute past the hour
  useEffect(() => {
    const checkForRefresh = () => {
      const now = new Date();
      if (now.getMinutes() === 1) {
        refetch();
      }
    };

    // Check every minute if it's time to refresh
    const interval = setInterval(checkForRefresh, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  return {
    usedTokens: data?.getUserQuota?.usedTokens || 0,
    allowedTokens: data?.getUserQuota?.allowedTokens || 10000000,
    loading,
    error,
    refetch,
  };
}
