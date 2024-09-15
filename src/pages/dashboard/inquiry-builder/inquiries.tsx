import { GET_INQUIRIES } from '@/clients/queries';
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
    navigate(`/dashboard/inquiry/${id}`);
  };

  return (
    <InquiryBuilderProvider>
      <ModalUpsertInquiry open={createFormModal} onClose={() => setCreateFormModal(false)} onSave={onCreateForm} />

      <div className="mb-8 text-slate-100">
        <h2 className="text-2xl font-semibold mb-4">Are you responsible for a large group of stakeholders?</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>User base of your product/service</li>
          <li>Workforce/Shareholders of your company</li>
          <li>Audience of your content</li>
          <li>Constituents you represent</li>
          <li>Members of your social organization</li>
          <li>Any other group you want to gain insights from</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">Do you want to make decisions in their best interest?</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Gather detailed responses across multiple modalities</li>
          <li>Build consensus from more voices than you could ever engage individually</li>
          <li>Make informed decisions backed by comprehensive data and our advanced analysis</li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Your Inquiries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {(data?.getInquiries ?? []).map((inquiry) => {
          const form = inquiry.data.form;
          const updatedAt = new Date(inquiry.updatedAt);
          const formattedDate = updatedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          return (
            <motion.div
              key={inquiry.id}
              className="bg-white p-4 text-black rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(inquiry.id)}
            >
              <h3 className="text-lg font-semibold mb-2">{form.title === '' ? 'Untitled Form' : form.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {form.organizationName === '' ? 'No Organization' : form.organizationName} - {formattedDate}
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
