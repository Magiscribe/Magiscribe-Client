import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { formatGraph, validateGraph } from '@/utils/graphs/graph-utils';
import { faCheckCircle, faEye, faGear, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from '@/components/modals/confirm-modal';
import ModalSendInquiry from '@/components/modals/send-inquiry-modal';

interface GraphContextBarProps {
  onOpenGraphGenerator: () => void;
  onAutoFix: (errors: string[]) => void;
}

export default function GraphContextBar({ onOpenGraphGenerator, onAutoFix }: GraphContextBarProps) {
  // States
  const [clearGraphModal, setClearGraphModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);

  // Hooks
  const { id, form, graph, lastUpdated, updateForm, updateGraph, resetGraph, deleteInquiry } = useInquiryBuilder();
  const alert = useAddAlert();
  const navigate = useNavigate();

  // Misc
  const previewLink = `${window.location.origin}/inquiry/${id}?preview=true`;

  /**
   * Handle formatting the graph.
   */
  const handleFormat = () => {
    updateGraph(formatGraph(graph));
    alert('Graph formatted successfully!', 'success');
  };

  /**
   * Handle validating the graph.
   */
  const handlePublish = () => {
    const validationResult = validateGraph(graph);
    if (validationResult === true) {
      setValidationErrors(null);
    } else {
      setValidationErrors(validationResult);
    }
    setSendModalOpen(true);
  };

  const handleAutoFix = (errors: string[]) => {
    onOpenGraphGenerator();
    onAutoFix(errors);
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              updateForm({ ...form, title: e.target.value });
            }}
            className="text-2xl font-bold w-full border-2 border-slate-200 p-2 rounded-lg"
          />
          <p className="text-sm text-slate-500">
            Last updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
            onClick={handlePublish}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Publish
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
            onClick={handleFormat}
          >
            <FontAwesomeIcon icon={faGear} className="mr-2" />
            Format
          </button>
          <Link
            to={previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Preview
          </Link>
          <button
            onClick={() => setClearGraphModal(true)}
            className="bg-gray-500 hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
            Clear
          </button>
          <button
            onClick={() => setDeleteModal(true)}
            className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={clearGraphModal}
        onClose={() => setClearGraphModal(false)}
        onConfirm={() => {
          resetGraph();
          setClearGraphModal(false);
          alert('Graph cleared successfully!', 'success');
        }}
        text="Are you sure you want to clear the graph? This action cannot be undone."
        confirmText="Clear Graph"
      />

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={async () => {
          await deleteInquiry(
            () => {
              alert('Inquiry deleted successfully!', 'success');
              navigate('/dashboard/inquiry-builder');
            },
            () => {
              alert('Something went wrong!', 'error');
            },
          );
        }}
        text="Are you sure you want to delete the inquiry?"
        confirmText="Delete Inquiry"
      />

      <ModalSendInquiry
        id={id ?? ''}
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        validationErrors={validationErrors}
        onAutoFix={handleAutoFix}
      />
    </>
  );
}
