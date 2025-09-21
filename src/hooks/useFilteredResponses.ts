import { useQuery } from "@apollo/client/react";
import { GET_INQUIRIES_RESPONSES } from '@/clients/queries';
import { GetInquiryResponsesQuery } from '@/graphql/graphql';
import { useAnalysisFilters } from '@/contexts/AnalysisFilterContext';

interface UseFilteredResponsesOptions {
  id: string;
  applyFilters?: boolean;
}

export const useFilteredResponses = ({ id, applyFilters = true }: UseFilteredResponsesOptions) => {
  const { filters } = useAnalysisFilters();

  // Apply filters only if applyFilters is true and we have active filters
  const shouldApplyFilters = applyFilters && Object.keys(filters).length > 0;
  const queryFilters = shouldApplyFilters ? filters : undefined;

  const { data, loading, error, refetch } = useQuery<GetInquiryResponsesQuery>(GET_INQUIRIES_RESPONSES, {
    variables: {
      id,
      filters: queryFilters,
    },
    errorPolicy: 'all',
  });

  return {
    responses: data?.getInquiryResponses ?? [],
    loading,
    error,
    refetch,
    isFiltered: shouldApplyFilters,
  };
};
