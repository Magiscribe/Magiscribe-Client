import { useAddAlert } from '@/providers/alert-provider';
import CustomModal from './modal';
import { faLink, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/controls/button';

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
  /**
   * The validation errors to display.
   */
  validationErrors: string[] | null;
  /**
   * A callback triggered when the modal requests to be closed.
   * @returns {void} Does not return anything.
   */
  onAutoFix: (errors: string[]) => void;
}

export default function ModalSendInquiry({ id, open, onClose, validationErrors, onAutoFix }: ModalSendInquiryProps) {
  const link = `${window.location.origin}/inquiry/${id}`;
  const alert = useAddAlert();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard', 'info');
    onClose();
  };

  const handleAutoFix = () => {
    if (validationErrors) {
      onAutoFix(validationErrors);
    }
    onClose();
  };

  const renderErrorList = () => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2">Validation Errors:</h3>
      <ul className="list-disc list-inside">
        {validationErrors?.map((error, index) => (
          <li key={index} className="text-red-600">
            {error}
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-4">
        <Button onClick={handleAutoFix} variant="primary" iconLeft={faMagicWandSparkles}>
          Automagically Fix
        </Button>
      </div>
    </div>
  );

  return (
    <CustomModal open={open} onClose={onClose} title={validationErrors ? 'Validation Failed' : 'Send'} size="4xl">
      {validationErrors ? (
        renderErrorList()
      ) : (
        <>
          <p className="text-slate-600 mb-6">Send the link to anyone you want to get input from</p>
          <div className="flex items-stretch">
            <p className="flex-grow p-2 rounded-l-md border border-r-0 border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500">
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
        </>
      )}
    </CustomModal>
  );
}
