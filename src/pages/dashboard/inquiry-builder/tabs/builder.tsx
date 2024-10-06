import ChatPopover from '@/components/controls/popovers/chat-popover';
import ChatWindowContainer from '@/components/controls/popovers/fixed-popover';
import GraphInput from '@/components/graph/graph-input';
import ConfirmationModal from '@/components/modals/confirm-modal';
import ModalGenerateInquiryGraph from '@/components/modals/generate-inquiry-modal';
import ModalUpsertInquiry from '@/components/modals/upsert-inquiry-modal';
import { useAddAlert } from '@/providers/alert-provider';
import { useInquiryBuilder } from '@/providers/inquiry-builder-provider';
import { formatGraph } from '@/utils/graphs/graph-utils';
import { faEye, faGear, faRotateLeft, faSpinner, faTrash, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const DEBOUNCE_DELAY_IN_MS = 1000;

/**
 * Setup component for creating and managing decision graphs.
 * @param {Object} props - Component props
 * @param {string} props.id - The ID of the current setup
 */
export default function InquiryBuilder() {
  // States
  const [upsertFormModal, setUpsertFormModal] = useState(false);
  const [clearGraphModal, setClearGraphModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  // Refs
  const saveDebounce = useRef<NodeJS.Timeout>();

  // Hooks
  const {
    initialized,
    form,
    graph,
    lastUpdated,
    updateForm,
    updateGraph,
    saveGraph,
    resetGraph,
    onEdgesChange,
    onNodesChange,
    updateGraphEdges,
    updateGraphNodes,
    generatingGraph,
    saveForm,
    onGraphGenerated,
    deleteInquiry,
  } = useInquiryBuilder();
  const alert = useAddAlert();
  const { id } = useParams<{ id: string }>();
  const previewLink = `${window.location.origin}/inquiry/${id}?preview=true`;

  onGraphGenerated?.(() => {
    if (generateModalOpen) setGenerateModalOpen(false);
  });

  const navigate = useNavigate();

  /**
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      saveGraph(); // Function to save the graph
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [graph]);

  /**
   * A debounced function to save the graph after a delay.
   */
  useEffect(() => {
    if (saveDebounce.current) {
      clearTimeout(saveDebounce.current);
    }

    saveDebounce.current = setTimeout(() => {
      saveForm(); // Function to save the graph
    }, DEBOUNCE_DELAY_IN_MS);

    // Cleanup function to clear the timeout if the component unmounts or the effect re-runs
    return () => {
      if (saveDebounce.current) {
        clearTimeout(saveDebounce.current);
      }
    };
  }, [form]);

  /**
   * Handle formatting the graph.
   */
  const handleFormat = () => {
    updateGraph(formatGraph(graph));
    alert('Graph formatted successfully!', 'success');
  };

  return (
    <>
      <div className="h-[85vh] flex flex-col border-white border-2 rounded-2xl overflow-hidden">
        <div className="bg-white p-4 space-y-4 text-slate-700">
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
                className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center"
                onClick={() => setGenerateModalOpen(true)}
                disabled={generatingGraph}
              >
                <FontAwesomeIcon
                  icon={generatingGraph ? faSpinner : faWandMagicSparkles}
                  className="mr-2"
                  spin={generatingGraph}
                />
                Generate
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
        </div>
        <div className="flex-grow">
          {initialized && (
            <GraphInput
              nodes={graph.nodes}
              edges={graph.edges}
              setNodes={updateGraphNodes}
              setEdges={updateGraphEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            />
          )}
        </div>
      </div>

      <ModalUpsertInquiry
        open={upsertFormModal}
        onClose={() => setUpsertFormModal(false)}
        onSave={() => {
          setUpsertFormModal(false);
        }}
      />

      <ModalGenerateInquiryGraph open={generateModalOpen} onClose={() => setGenerateModalOpen(false)} />

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

      <ChatPopover label="Chat with Assistant" onGenerateGraph={saveForm} />
    </>
  );
}
