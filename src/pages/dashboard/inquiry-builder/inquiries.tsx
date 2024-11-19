import { GET_INQUIRIES, GET_INQUIRY_RESPONSE_COUNT } from '@/clients/queries';
import GenericHero from '@/components/heroes/generic-hero';
import ModalUpsertInquiry from '@/components/modals/inquiry/create-inquiry-modal';
import { GetInquiriesQuery } from '@/graphql/graphql';
import { Inquiry } from '@/graphql/types';
import { InquiryBuilderProvider } from '@/providers/inquiry-builder-provider';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const form = inquiry.data.form;

  // Add the response count query
  const { data: responseCountData } = useQuery(GET_INQUIRY_RESPONSE_COUNT, {
    variables: { id: inquiry.id },
  });

  const createdAt = new Date(inquiry.createdAt);
  const updatedAt = new Date(inquiry.updatedAt);

  const formattedUpdateDate = updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedCreateDate = createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link to={`/dashboard/inquiry-builder/${inquiry.id}`} className="hover:no-underline">
      <motion.div
        key={inquiry.id}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 100 }}
        className="bg-white dark:bg-slate-600 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-lg text-slate-900 dark:text-slate-100 font-semibold">{form.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Created: {formattedCreateDate} | Updated: {formattedUpdateDate}
          </p>
          <div className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {responseCountData?.getInquiryResponseCount ?? 0}{' '}
              {responseCountData?.getInquiryResponseCount == 1 ? 'response' : 'responses'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Inquiries() {
  // States
  const [createFormModal, setCreateFormModal] = useState(false);

  // Hooks
  const navigate = useNavigate();

  // Queries
  const { data } = useQuery<GetInquiriesQuery>(GET_INQUIRIES);

  /**
   * Redirects to the inquiry form creation page on form creation.
   * @param id {string} The ID of the inquiry form.
   */
  const onCreateForm = (id: string) => {
    navigate(`/dashboard/inquiry-builder/${id}`);
  };

  return (
    <InquiryBuilderProvider>
      <ModalUpsertInquiry open={createFormModal} onClose={() => setCreateFormModal(false)} onSave={onCreateForm} />

      <GenericHero
        title="Your Inquiries"
        subtitle="Build and manage inquiries here to start capturing meaningful feedback."
      />
      <hr className="my-8" />
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Your Inquiries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {(data?.getInquiries ?? []).map((inquiry) => (
          <InquiryCard inquiry={inquiry} key={inquiry.id} />
        ))}
        <motion.div
          className="bg-blue-500 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          onClick={() => setCreateFormModal(true)}
        >
          <span className="text-4xl font-bold text-white">+</span>
        </motion.div>
      </div>
    </InquiryBuilderProvider>
  );
}
