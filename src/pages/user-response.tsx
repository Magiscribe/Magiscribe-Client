import { GET_INQUIRY, GET_INQUIRY_RESPONSE } from '@/clients/queries';
import UserResponses from '@/components/analysis/user-responses';
import { GetInquiryQuery, GetInquiryResponseQuery } from '@/graphql/graphql';
import { useSetTitle } from '@/hooks/title-hook';
import { useQuery } from "@apollo/client/react";
import { useParams, useSearchParams } from 'react-router-dom';

export default function UserResponsePage() {
  // State
  const { id } = useParams<{ id: string }>();

  // Hooks
  const [searchParams] = useSearchParams();

  // Apollo Hooks
  const { data: inquiryData, loading: inquiryLoading } = useQuery<GetInquiryQuery>(GET_INQUIRY, {
    variables: { id },
    skip: !id,
  });

  const { data: responseData, loading: responseLoading } = useQuery<GetInquiryResponseQuery>(GET_INQUIRY_RESPONSE, {
    variables: { id: searchParams.get('id') },
    skip: !searchParams.get('id'),
  });

  useSetTitle()('Response');

  /*================================ RENDER FUNCTIONS ==============================*/

  if (!responseData?.getInquiryResponse) {
    return <></>;
  }

  return (
    <>
      <div className="w-full max-w-4xl grow p-4 space-y-4 mx-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white text-center">Your Response</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-4">
            Submitted on{' '}
            {new Date(responseData?.getInquiryResponse?.createdAt).toLocaleString('en', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>

          <div className="flex justify-between items-center mb-4">
            {!inquiryLoading && !responseLoading && (
              <UserResponses inquiryData={inquiryData} userData={responseData?.getInquiryResponse?.data.history} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
