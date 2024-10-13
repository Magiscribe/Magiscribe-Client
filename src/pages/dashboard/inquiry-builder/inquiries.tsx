import { GET_INQUIRIES } from '@/clients/queries';
import GenericHero from '@/components/heroes/generic-hero';
import ModalUpsertInquiry from '@/components/modals/upsert-inquiry-modal';
import { GetInquiriesQuery } from '@/graphql/graphql';
import { InquiryBuilderProvider } from '@/providers/inquiry-builder-provider';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inquiry() {
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
        {(data?.getInquiries ?? []).map((inquiry, i) => {
          const form = inquiry.data.form;

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
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 100, delay: i * 0.1 }}
              className="bg-white p-4 text-black rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(inquiry.id)}
            >
              <h3 className="text-lg font-semibold mb-2">{form.title === '' ? 'Untitled Inquiry' : form.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Created: {formattedCreateDate} | Updated: {formattedUpdateDate}
              </p>
            </motion.div>
          );
        })}
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
