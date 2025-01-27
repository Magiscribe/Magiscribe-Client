import React from 'react';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CustomModal from '../modal';
import Button from '@/components/controls/button';
import { ModalShareInquiry } from './share-inquiry-modal';

interface SendInquiryProps {
  /**
   * Whether the modal is open or not.
   */
  open: boolean;

  /**
   * A callback triggered when the modal requests to be closed.
   * @returns {void} Does not return anything.
   */
  onClose: () => void;
}

/**
 * A component to display and share the inquiry link.
 */
export default function SendInquiry({ open, onClose }: SendInquiryProps) {
  const { id } = useInquiryBuilder();
  const [showShareInquiryModal, setShowShareInquiryModal] = React.useState(false);
  const link = `${window.location.origin}/inquiry/${id}`;
  const alert = useAddAlert();

  /**
   * Handle copying the link to the clipboard, show an info alert, and close the modal.
   */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard', 'info');
    onClose();
  };

  return (
    <>
      <CustomModal open={open} onClose={onClose} title="Send Inquiry" size="4xl">
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Share the link to this inquiry with anyone you want to get input from
        </p>
        <div className="flex items-stretch">
          <p className="grow p-2 rounded-l-md border border-r-0 border-slate-300 shadow-xs focus:border-slate-500 focus:ring-slate-500">
            {link}
          </p>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-4 rounded-r-md text-sm font-medium shadow-xs text-white bg-slate-600 hover:bg-slate-700 focus:outline-hidden"
          >
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            <span className="whitespace-nowrap">Copy Link</span>
          </button>
        </div>
      </CustomModal>
      <ModalShareInquiry open={showShareInquiryModal} onClose={() => setShowShareInquiryModal(false)} />
    </>
  );
}
