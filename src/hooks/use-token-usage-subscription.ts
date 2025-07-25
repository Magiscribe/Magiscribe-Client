import { useTokenUsage } from '@/providers/token-usage-provider';
import { PredictionAddedSubscription } from '@/graphql/types';

/**
 * Hook that automatically updates token usage from subscription data
 */
export function useTokenUsageFromSubscription() {
  const { addFromAPI } = useTokenUsage();

  const handleSubscriptionData = (subscriptionData: { data?: PredictionAddedSubscription }) => {
    const prediction = subscriptionData.data?.predictionAdded;
    
    // Only add tokens on SUCCESS events that include token usage data
    if (prediction?.type === 'SUCCESS' && prediction.tokenUsage) {
      addFromAPI({
        inputTokens: prediction.tokenUsage.inputTokens,
        outputTokens: prediction.tokenUsage.outputTokens,
        totalTokens: prediction.tokenUsage.totalTokens,
      });
    }
  };

  return { handleSubscriptionData };
}
