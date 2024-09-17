import { useAddAlert } from '@/providers/alert-provider';
import CustomModal from '../modal';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ModalSendInquiryProps {
  /**
   * The inquiry ID to Send.
   */
  id: string;

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

export default function ModalSendInquiry({ id, open, onClose }: ModalSendInquiryProps) {
  const link = `${window.location.origin}/inquiry/${id}`;

  // Hooks
  const alert = useAddAlert();

  /**
   * Handle copying the link to the clipboard, show a info alert, and close the modal.
   */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard', 'info');
    onClose();
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Send" size="4xl">
      <p className="text-slate-600 mb-6">Send the link with anyone you want to get input from</p>
      <div className="flex items-stretch">
        <p className="flex-grow bg-white p-2 rounded-l-md border border-r-0 border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500">
          {link}
        </p>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center px-4 rounded-r-md text-sm font-medium shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none"
        >
          <FontAwesomeIcon icon={faLink} className="mr-2" />
          <span className="whitespace-nowrap">Copy Link</span>
        </button>
      </div>
    </CustomModal>
  );
}
