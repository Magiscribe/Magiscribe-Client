import { ApolloError, useQuery } from "@apollo/client/react";
import { useEffect } from 'react';
import { GET_USER_QUOTA } from '@/clients/queries';

interface UserQuota {
  userId: string;
  allowedTokens: number;
  usedTotalTokens: number;
  usedInputTokens: number;
  usedOutputTokens: number;
  createdAt: string;
  updatedAt: string;
}

interface UseUserQuotaReturn {
  usedTotalTokens: number;
  usedInputTokens: number;
  usedOutputTokens: number;
  allowedTokens: number;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  updatedAt: string;
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
    usedTotalTokens: data?.getUserQuota?.usedTotalTokens || 0,
    usedInputTokens: data?.getUserQuota?.usedInputTokens || 0,
    usedOutputTokens: data?.getUserQuota?.usedOutputTokens || 0,
    allowedTokens: data?.getUserQuota?.allowedTokens || 10000000,
    loading,
    error,
    refetch,
    updatedAt: data?.getUserQuota?.updatedAt || '',
  };
}
