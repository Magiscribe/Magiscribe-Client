import { useEffect, useState } from 'react';
import { GET_INQUIRY_RESPONSE_TIME } from '@/clients/queries';
import { GetAverageInquiryResponseTimeQuery } from '@/graphql/graphql';
import { useLazyQuery } from '@apollo/client/react';
import { useInquiry } from '@/providers/inquiry-traversal-provider';

export function useInquiryResponseTime(): string {
  const { id } = useInquiry();
  const [getInquiryResponseTime] = useLazyQuery<GetAverageInquiryResponseTimeQuery>(GET_INQUIRY_RESPONSE_TIME);
  const [responseTime, setResponseTime] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const responseTimeResults = await getInquiryResponseTime({
        variables: {
          id,
        },
      });
      setResponseTime(Math.ceil(responseTimeResults?.data?.getAverageInquiryResponseTime.minutes ?? 0));
    })();
  }, [id]);

  return responseTime > 0 ? (responseTime === 1 ? `${responseTime} minute` : `${responseTime} minutes`) : '';
}
